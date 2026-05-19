import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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

  const price = course?.priceType === 'free' ? 'مجاني' : `$${Number(course?.price || 0).toFixed(2)}`;
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
      setError('يرجى تعبئة جميع الحقول المطلوبة.');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      await enrollInCourse(id);
      setSuccess('تم الدفع بنجاح! جاري تحويلك إلى الدورة...');
      setTimeout(() => navigate(`/apprenant/course/${id}/learn`), 1200);
    } catch (e) {
      setError(e.response?.data?.message || 'فشل الدفع. الرجاء المحاولة مرة أخرى.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ApprenantLayout>
      <div className="checkout-page">
        <div className="checkout-header">
          <p className="checkout-label">الدفع</p>
          <h1 className="checkout-title">أكمل تسجيلك</h1>
          <p className="checkout-subtitle">
            {course ? `احجز مكانك في ${course.title}` : 'احجز مكانك في هذه الدورة.'}
          </p>
        </div>

        <div className="checkout-grid">
          <section className="checkout-form-card">
            {/* Plan Selection */}
            <div className="checkout-plan-card">
              <h2>اختر خطتك</h2>
              <div className="checkout-plans">
                <div 
                  className={`checkout-plan-option ${plan === 'yearly' ? 'selected' : ''}`}
                  onClick={() => setPlan('yearly')}
                >
                  <div className="plan-header">
                    <h3>الوصول السنوي</h3>
                    <span className="plan-badge">الأكثر شيوعًا</span>
                  </div>
                  <div className="plan-price">
                    <span className="price-main">{price}</span>
                    <span className="price-period">/سنة</span>
                  </div>
                  <p className="plan-description">وصول كامل إلى محتوى الدورة لمدة عام واحد</p>
                </div>
                
                <div 
                  className={`checkout-plan-option ${plan === 'monthly' ? 'selected' : ''}`}
                  onClick={() => setPlan('monthly')}
                >
                  <div className="plan-header">
                    <h3>الوصول الشهري</h3>
                  </div>
                  <div className="plan-price">
                    <span className="price-main">${Number(course?.price || 0).toFixed(0)}</span>
                    <span className="price-period">/شهر</span>
                  </div>
                  <p className="plan-description">وصول مرن إلى محتوى الدورة شهريًا</p>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="checkout-payment-method">
              <h2>طريقة الدفع</h2>
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
                  <span>بطاقة ائتمان</span>
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
                  <span>باي بال</span>
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
                  <span>جوجل باي</span>
                </label>
              </div>
            </div>

            {/* Credit Card Form - Only show when credit card is selected */}
            {paymentMethod === 'credit-card' && (
              <div className="checkout-card-form">
                <div className="checkout-card-top">
                  <h2>بيانات البطاقة</h2>
                  <p>أدخل معلومات بطاقتك بأمان.</p>
                </div>

                {loading ? (
                  <div className="checkout-loading">جارٍ تحميل تفاصيل الدورة...</div>
                ) : (
                  <form className="checkout-form" onSubmit={handleCompletePayment}>
                    {error && <div className="checkout-error">{error}</div>}
                    {success && <div className="checkout-success">{success}</div>}

                    <label>
                      الاسم على البطاقة
                      <input
                        type="text"
                        value={billing.nameOnCard}
                        onChange={e => handleInput('nameOnCard', e.target.value)}
                        placeholder="أحمد محمد"
                        required
                      />
                    </label>

                    <label>
                      رقم البطاقة
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
                        تاريخ الانتهاء
                        <input
                          type="text"
                          value={billing.expiry}
                          onChange={e => handleInput('expiry', e.target.value)}
                          placeholder="MM / YY"
                          required
                        />
                      </label>
                      <label>
                        رمز الأمان
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
                      {processing ? 'جارٍ معالجة الدفع...' : isPaid ? 'أكمل الدفع' : 'تابع إلى الدورة'}
                    </button>

                    <p className="checkout-note">
                      هذه تجربة دفع وهمية. لن يتم خصم أي مبلغ من بطاقتك.
                    </p>
                  </form>
                )}
              </div>
            )}

            {/* PayPal and Google Pay placeholders */}
            {(paymentMethod === 'paypal' || paymentMethod === 'google-pay') && (
              <div className="checkout-alt-payment">
                <div className="checkout-card-top">
                  <h2>{paymentMethod === 'paypal' ? 'دفع باي بال' : 'دفع جوجل باي'}</h2>
                  <p>سيتم تحويلك لإكمال الدفع بطريقة آمنة.</p>
                </div>
                
                <form className="checkout-form" onSubmit={handleCompletePayment}>
                  {error && <div className="checkout-error">{error}</div>}
                  {success && <div className="checkout-success">{success}</div>}

                  <label>
                    البريد الإلكتروني
                    <input
                      type="email"
                      value={billing.email}
                      onChange={e => handleInput('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </label>

                  <button type="submit" className="checkout-submit-btn" disabled={processing}>
                    {processing ? 'جارٍ المعالجة...' : paymentMethod === 'paypal' ? 'ادفع عبر باي بال' : 'ادفع عبر جوجل باي'}
                  </button>

                  <p className="checkout-note">
                    هذه تجربة دفع وهمية. لن تتم معالجة أي دفعة حقيقية.
                  </p>
                </form>
              </div>
            )}
          </section>

          <aside className="checkout-summary-card">
            <div className="checkout-summary-top">
              <h2>ملخص الطلب</h2>
              <span className="checkout-badge">{isPaid ? 'دورة مدفوعة' : 'دورة مجانية'}</span>
            </div>

            <div className="checkout-summary-item">
              <span>الدورة</span>
              <strong>{course?.title || 'جارٍ التحميل...'}</strong>
            </div>

            <div className="checkout-summary-item">
              <span>المدرب</span>
              <strong>{course?.formateur?.fullName || t('apprenant.instructor')}</strong>
            </div>

            <div className="checkout-summary-item">
              <span>المدة</span>
              <strong>{course ? `${Math.round((course.totalDuration || 0) / 60)} ساعة` : '—'}</strong>
            </div>

            <div className="checkout-summary-item">
              <span>السعر</span>
              <strong>{price}</strong>
            </div>

            {discount && (
              <div className="checkout-summary-item">
                <span>Discount</span>
                <strong>{discount}% off</strong>
              </div>
            )}

            <div className="checkout-summary-total">
              <span>المبلغ المستحق</span>
              <strong>{isPaid ? price : 'مجاني'}</strong>
            </div>

            <div className="checkout-summary-footer">
              <p>بعد الدفع، سيتم تحويلك إلى مشغل الدورة لتبدأ التعلم فورًا.</p>
            </div>
          </aside>
        </div>
      </div>
    </ApprenantLayout>
  );
};

export default CheckoutPage;
