import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import { getCourseDetails, enrollInCourse } from '../../services/apprenentService';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [billing, setBilling] = useState({
    fullName: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    nameOnCard: '',
  });
  const [plan, setPlan] = useState('yearly'); // 'yearly' or 'monthly'
  const [paymentMethod, setPaymentMethod] = useState('credit-card'); // 'credit-card', 'paypal', 'google-pay'

  const isPaid = location.state?.isPaid ?? true;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCourseDetails(id)
      .then((res) => setCourse(res.data?.data))
      .catch(() => setError('Could not load course details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const price = course?.priceType === 'free' ? 'FREE' : `$${Number(course?.price || 0).toFixed(2)}`;
  const discount = course?.discount?.percentage;

  const handleInput = (field, value) => {
    setBilling(prev => ({ ...prev, [field]: value }));
  };

  const handleCompletePayment = async (event) => {
    event.preventDefault();
    if (!isPaid) {
      navigate(`/apprenant/course/${id}/learn`);
      return;
    }

    let valid = billing.email;
    
    if (paymentMethod === 'credit-card') {
      valid = valid && billing.nameOnCard && billing.cardNumber && billing.expiry && billing.cvc;
    }
    
    if (!valid) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      await enrollInCourse(id);
      setSuccess('Payment successful! Redirecting to your course...');
      setTimeout(() => navigate(`/apprenant/course/${id}/learn`), 1200);
    } catch (e) {
      setError(e.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ApprenantLayout>
      <div className="checkout-page">
        <div className="checkout-header">
          <p className="checkout-label">Checkout</p>
          <h1 className="checkout-title">Complete your enrollment</h1>
          <p className="checkout-subtitle">
            {course ? `Secure your spot in ${course.title}` : 'Secure your spot in this course.'}
          </p>
        </div>

        <div className="checkout-grid">
          <section className="checkout-form-card">
            {/* Plan Selection */}
            <div className="checkout-plan-card">
              <h2>Choose your plan</h2>
              <div className="checkout-plans">
                <div 
                  className={`checkout-plan-option ${plan === 'yearly' ? 'selected' : ''}`}
                  onClick={() => setPlan('yearly')}
                >
                  <div className="plan-header">
                    <h3>Yearly Access</h3>
                    <span className="plan-badge">Most Popular</span>
                  </div>
                  <div className="plan-price">
                    <span className="price-main">{price}</span>
                    <span className="price-period">/year</span>
                  </div>
                  <p className="plan-description">Full access to all course content for one year</p>
                </div>
                
                <div 
                  className={`checkout-plan-option ${plan === 'monthly' ? 'selected' : ''}`}
                  onClick={() => setPlan('monthly')}
                >
                  <div className="plan-header">
                    <h3>Monthly Access</h3>
                  </div>
                  <div className="plan-price">
                    <span className="price-main">${Number(course?.price || 0).toFixed(0)}</span>
                    <span className="price-period">/month</span>
                  </div>
                  <p className="plan-description">Flexible monthly access to course content</p>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="checkout-payment-method">
              <h2>Payment method</h2>
              <div className="payment-methods">
                <label className="payment-method-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={paymentMethod === 'credit-card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="method-icon">💳</span>
                  <span>Credit Card</span>
                </label>
                
                <label className="payment-method-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="method-icon">🅿️</span>
                  <span>PayPal</span>
                </label>
                
                <label className="payment-method-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="google-pay"
                    checked={paymentMethod === 'google-pay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="method-icon">🇬</span>
                  <span>Google Pay</span>
                </label>
              </div>
            </div>

            {/* Credit Card Form - Only show when credit card is selected */}
            {paymentMethod === 'credit-card' && (
              <div className="checkout-card-form">
                <div className="checkout-card-top">
                  <h2>Card details</h2>
                  <p>Enter your card information securely.</p>
                </div>

                {loading ? (
                  <div className="checkout-loading">Loading course details...</div>
                ) : (
                  <form className="checkout-form" onSubmit={handleCompletePayment}>
                    {error && <div className="checkout-error">{error}</div>}
                    {success && <div className="checkout-success">{success}</div>}

                    <label>
                      Name on card
                      <input
                        type="text"
                        value={billing.nameOnCard}
                        onChange={e => handleInput('nameOnCard', e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </label>

                    <label>
                      Card number
                      <input
                        type="text"
                        value={billing.cardNumber}
                        onChange={e => handleInput('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </label>

                    <div className="checkout-form-row">
                      <label>
                        Expiry date
                        <input
                          type="text"
                          value={billing.expiry}
                          onChange={e => handleInput('expiry', e.target.value)}
                          placeholder="MM / YY"
                          required
                        />
                      </label>
                      <label>
                        CVC
                        <input
                          type="text"
                          value={billing.cvc}
                          onChange={e => handleInput('cvc', e.target.value)}
                          placeholder="123"
                          required
                        />
                      </label>
                    </div>

                    <button type="submit" className="checkout-submit-btn" disabled={processing}>
                      {processing ? 'Processing payment...' : isPaid ? 'Complete Payment' : 'Continue to Course'}
                    </button>

                    <p className="checkout-note">
                      This is a mock checkout experience. Your card will not be charged.
                    </p>
                  </form>
                )}
              </div>
            )}

            {/* PayPal and Google Pay placeholders */}
            {(paymentMethod === 'paypal' || paymentMethod === 'google-pay') && (
              <div className="checkout-alt-payment">
                <div className="checkout-card-top">
                  <h2>{paymentMethod === 'paypal' ? 'PayPal' : 'Google Pay'} Payment</h2>
                  <p>You will be redirected to complete your payment securely.</p>
                </div>
                
                <form className="checkout-form" onSubmit={handleCompletePayment}>
                  {error && <div className="checkout-error">{error}</div>}
                  {success && <div className="checkout-success">{success}</div>}

                  <label>
                    Email address
                    <input
                      type="email"
                      value={billing.email}
                      onChange={e => handleInput('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </label>

                  <button type="submit" className="checkout-submit-btn" disabled={processing}>
                    {processing ? 'Processing...' : `Pay with ${paymentMethod === 'paypal' ? 'PayPal' : 'Google Pay'}`}
                  </button>

                  <p className="checkout-note">
                    This is a mock checkout experience. No real payment will be processed.
                  </p>
                </form>
              </div>
            )}
          </section>

          <aside className="checkout-summary-card">
            <div className="checkout-summary-top">
              <h2>Order summary</h2>
              <span className="checkout-badge">{isPaid ? 'Paid course' : 'Free course'}</span>
            </div>

            <div className="checkout-summary-item">
              <span>Course</span>
              <strong>{course?.title || 'Loading...'}</strong>
            </div>

            <div className="checkout-summary-item">
              <span>Instructor</span>
              <strong>{course?.formateur?.fullName || 'Instructor'}</strong>
            </div>

            <div className="checkout-summary-item">
              <span>Duration</span>
              <strong>{course ? `${Math.round((course.totalDuration || 0) / 60)} hours` : '—'}</strong>
            </div>

            <div className="checkout-summary-item">
              <span>Price</span>
              <strong>{price}</strong>
            </div>

            {discount && (
              <div className="checkout-summary-item">
                <span>Discount</span>
                <strong>{discount}% off</strong>
              </div>
            )}

            <div className="checkout-summary-total">
              <span>Total due</span>
              <strong>{isPaid ? price : 'FREE'}</strong>
            </div>

            <div className="checkout-summary-footer">
              <p>After payment, you will be redirected to the course player where you can start learning immediately.</p>
            </div>
          </aside>
        </div>
      </div>
    </ApprenantLayout>
  );
};

export default CheckoutPage;
