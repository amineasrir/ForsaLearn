const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('paypal-rest-sdk');

// STRIPE CONFIGURATION

const initializeStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('Stripe not configured. Payment service disabled.');
    return null;
  }
  
  console.log('Stripe initialized');
  return stripe;
};

// PAYPAL CONFIGURATION

const initializePayPal = () => {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    console.warn('PayPal not configured. Payment service disabled.');
    return false;
  }
  
  paypal.configure({
    mode: process.env.PAYPAL_MODE || 'sandbox', // sandbox or live
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
  });
  
  console.log('PayPal initialized');
  return true;
};

// Initialize payment services
const stripeClient = initializeStripe();
const paypalInitialized = initializePayPal();

// STRIPE HELPER FUNCTIONS

// Create Stripe Payment Intent
const createStripePaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    if (!stripeClient) {
      throw new Error('Stripe not configured');
    }
    
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Retrieve Stripe Payment Intent
const retrieveStripePaymentIntent = async (paymentIntentId) => {
  try {
    if (!stripeClient) {
      throw new Error('Stripe not configured');
    }
    
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    return {
      success: true,
      paymentIntent
    };
  } catch (error) {
    console.error('Stripe retrieve error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Create Stripe Customer
const createStripeCustomer = async (email, name, metadata = {}) => {
  try {
    if (!stripeClient) {
      throw new Error('Stripe not configured');
    }
    
    const customer = await stripeClient.customers.create({
      email,
      name,
      metadata
    });
    
    return {
      success: true,
      customerId: customer.id
    };
  } catch (error) {
    console.error('Stripe customer error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Create Stripe Refund
const createStripeRefund = async (paymentIntentId, amount = null) => {
  try {
    if (!stripeClient) {
      throw new Error('Stripe not configured');
    }
    
    const refundData = { payment_intent: paymentIntentId };
    if (amount) {
      refundData.amount = Math.round(amount * 100);
    }
    
    const refund = await stripeClient.refunds.create(refundData);
    
    return {
      success: true,
      refund
    };
  } catch (error) {
    console.error('Stripe refund error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// PAYPAL HELPER FUNCTIONS

// Create PayPal Payment
const createPayPalPayment = (amount, currency, description, returnUrl, cancelUrl) => {
  return new Promise((resolve, reject) => {
    if (!paypalInitialized) {
      return reject(new Error('PayPal not configured'));
    }
    
    const paymentData = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: returnUrl,
        cancel_url: cancelUrl
      },
      transactions: [{
        amount: {
          total: amount.toFixed(2),
          currency: currency.toUpperCase()
        },
        description
      }]
    };
    
    paypal.payment.create(paymentData, (error, payment) => {
      if (error) {
        console.error('PayPal payment error:', error);
        return reject(error);
      }
      
      // Get approval URL
      const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
      
      resolve({
        success: true,
        paymentId: payment.id,
        approvalUrl: approvalUrl ? approvalUrl.href : null
      });
    });
  });
};

// Execute PayPal Payment
const executePayPalPayment = (paymentId, payerId) => {
  return new Promise((resolve, reject) => {
    if (!paypalInitialized) {
      return reject(new Error('PayPal not configured'));
    }
    
    paypal.payment.execute(paymentId, { payer_id: payerId }, (error, payment) => {
      if (error) {
        console.error('PayPal execute error:', error);
        return reject(error);
      }
      
      resolve({
        success: true,
        payment
      });
    });
  });
};

// Get PayPal Payment Details
const getPayPalPayment = (paymentId) => {
  return new Promise((resolve, reject) => {
    if (!paypalInitialized) {
      return reject(new Error('PayPal not configured'));
    }
    
    paypal.payment.get(paymentId, (error, payment) => {
      if (error) {
        console.error('PayPal get payment error:', error);
        return reject(error);
      }
      
      resolve({
        success: true,
        payment
      });
    });
  });
};

// Create PayPal Refund
const createPayPalRefund = (saleId, amount, currency) => {
  return new Promise((resolve, reject) => {
    if (!paypalInitialized) {
      return reject(new Error('PayPal not configured'));
    }
    
    const refundData = {
      amount: {
        total: amount.toFixed(2),
        currency: currency.toUpperCase()
      }
    };
    
    paypal.sale.refund(saleId, refundData, (error, refund) => {
      if (error) {
        console.error('PayPal refund error:', error);
        return reject(error);
      }
      
      resolve({
        success: true,
        refund
      });
    });
  });
};

// CURRENCY CONVERSION

const convertCurrency = (amount, fromCurrency, toCurrency) => {
  // Simple conversion rates (in production, use real-time API)
  const rates = {
    MAD: { USD: 0.10, EUR: 0.09 },
    USD: { MAD: 10.00, EUR: 0.92 },
    EUR: { MAD: 11.00, USD: 1.09 }
  };
  
  if (fromCurrency === toCurrency) return amount;
  
  if (rates[fromCurrency] && rates[fromCurrency][toCurrency]) {
    return amount * rates[fromCurrency][toCurrency];
  }
  
  return amount; // Return original if conversion not found
};


module.exports = {
  // Stripe
  stripeClient,
  createStripePaymentIntent,
  retrieveStripePaymentIntent,
  createStripeCustomer,
  createStripeRefund,
  
  // PayPal
  createPayPalPayment,
  executePayPalPayment,
  getPayPalPayment,
  createPayPalRefund,
  
  // Utils
  convertCurrency
};