// config/email.js
const nodemailer = require('nodemailer');

// ============================================
// CREATE EMAIL TRANSPORTER
// ============================================
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️  Email credentials not configured. Email service disabled.');
    return null;
  }

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email service error:', error);
    } else {
      console.log('✅ Email service ready');
    }
  });

  return transporter;
};

const transporter = createTransporter();

// ============================================
// EMAIL SENDER FUNCTION
// ============================================
const sendEmail = async (options) => {
  try {
    if (!transporter) {
      console.warn('⚠️  Email service not configured. Email not sent.');
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'ForsaLearn'} <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('📧 Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Send email error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// EMAIL TEMPLATES
// ============================================

// Welcome Email Template
const welcomeEmailTemplate = (name, language = 'en') => {
  const content = {
    en: {
      title: 'Welcome to ForsaLearn',
      greeting: `Hello ${name}!`,
      intro: 'We are excited to have you join ForsaLearn learning platform.',
      description: 'On ForsaLearn, you can:',
      features: [
        'Access hundreds of educational courses',
        'Learn from the best instructors',
        'Get certified certificates',
        'Connect with the learning community'
      ],
      button: 'Start Learning Now',
      footer: 'If you have any questions, feel free to contact us.',
      signature: 'Best wishes,<br>ForsaLearn Team',
      copyright: '© 2024 ForsaLearn. All rights reserved.'
    },
    fr: {
      title: 'Bienvenue sur ForsaLearn',
      greeting: `Bonjour ${name}!`,
      intro: 'Nous sommes ravis de vous accueillir sur la plateforme ForsaLearn.',
      description: 'Sur ForsaLearn, vous pouvez:',
      features: [
        'Accéder à des centaines de cours',
        'Apprendre des meilleurs instructeurs',
        'Obtenir des certificats reconnus',
        'Rejoindre la communauté d\'apprenants'
      ],
      button: 'Commencer à Apprendre',
      footer: 'Si vous avez des questions, n\'hésitez pas à nous contacter.',
      signature: 'Cordialement,<br>L\'équipe ForsaLearn',
      copyright: '© 2024 ForsaLearn. Tous droits réservés.'
    }
  };
  
  const t = content[language] || content.en;
  
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #392C7D 0%, #FF4667 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 32px;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.6;
    }
    .content h2 {
      color: #392C7D;
      margin-top: 0;
    }
    .button {
      display: inline-block;
      padding: 15px 30px;
      background-color: #FF4667;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 20px;
      text-align: center;
      color: #666666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 ForsaLearn</h1>
    </div>
    <div class="content">
      <h2>${t.greeting}</h2>
      <p>${t.intro}</p>
      <p>${t.description}</p>
      <ul>
        ${t.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <p style="text-align: center;">
        <a href="${process.env.CLIENT_URL}" class="button">${t.button}</a>
      </p>
      <p>${t.footer}</p>
      <p>${t.signature}</p>
    </div>
    <div class="footer">
      <p>${t.copyright}</p>
      <p>${process.env.CLIENT_URL}</p>
    </div>
  </div>
</body>
</html>
`;
};

// Email Verification Template
const verificationEmailTemplate = (name, verificationLink, language = 'en') => {
  const content = {
    en: {
      title: 'Account Activation',
      greeting: `Hello ${name}!`,
      intro: 'Thank you for registering on ForsaLearn. Please activate your account by clicking the button below:',
      button: 'Activate Account',
      or: 'Or copy and paste this link in your browser:',
      note: '<strong>Note:</strong> This link is valid for 24 hours only.',
      ignore: 'If you did not create this account, please ignore this email.'
    },
    fr: {
      title: 'Activation du Compte',
      greeting: `Bonjour ${name}!`,
      intro: 'Merci de vous être inscrit sur ForsaLearn. Veuillez activer votre compte en cliquant sur le bouton ci-dessous:',
      button: 'Activer le Compte',
      or: 'Ou copiez et collez ce lien dans votre navigateur:',
      note: '<strong>Note:</strong> Ce lien n\'est valable que 24 heures.',
      ignore: 'Si vous n\'avez pas créé ce compte, veuillez ignorer cet email.'
    }
  };
  
  const t = content[language] || content.en;
  
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #392C7D 0%, #FF4667 100%);
      padding: 40px 20px;
      text-align: center;
      color: #ffffff;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 15px 30px;
      background-color: #FF4667;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 20px;
      text-align: center;
      color: #666666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✉️ ${t.title}</h1>
    </div>
    <div class="content">
      <h2>${t.greeting}</h2>
      <p>${t.intro}</p>
      <p style="text-align: center;">
        <a href="${verificationLink}" class="button">${t.button}</a>
      </p>
      <p style="color: #666; font-size: 14px;">
        ${t.or}<br>
        <a href="${verificationLink}">${verificationLink}</a>
      </p>
      <p>${t.note}</p>
    </div>
    <div class="footer">
      <p>${t.ignore}</p>
    </div>
  </div>
</body>
</html>
`;
};

// Formateur Approval Template
const formateurApprovalTemplate = (name, language = 'en') => {
  const content = {
    en: {
      title: 'Approved!',
      greeting: `Congratulations ${name}!`,
      intro: 'Your instructor account has been approved on ForsaLearn platform.',
      description: 'You can now:',
      features: [
        'Create new educational courses',
        'Manage your course content',
        'Interact with students',
        'Track your statistics and earnings'
      ],
      button: 'Go to Dashboard'
    },
    fr: {
      title: 'Approuvé!',
      greeting: `Félicitations ${name}!`,
      intro: 'Votre compte instructeur a été approuvé sur ForsaLearn.',
      description: 'Vous pouvez maintenant:',
      features: [
        'Créer de nouveaux cours',
        'Gérer le contenu de vos cours',
        'Interagir avec les étudiants',
        'Suivre vos statistiques et revenus'
      ],
      button: 'Accéder au Tableau de Bord'
    }
  };
  
  const t = content[language] || content.en;
  
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
    .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
    .button { display: inline-block; padding: 15px 30px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #666666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 ${t.title}</h1>
    </div>
    <div class="content">
      <h2>${t.greeting}</h2>
      <p>${t.intro}</p>
      <p>${t.description}</p>
      <ul>
        ${t.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <p style="text-align: center;">
        <a href="${process.env.CLIENT_URL}/formateur/dashboard" class="button">${t.button}</a>
      </p>
    </div>
    <div class="footer">
      <p>&copy; 2024 ForsaLearn. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};

// Formateur Rejection Template
const formateurRejectionTemplate = (name, reason) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
    .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
    .reason-box { background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .button { display: inline-block; padding: 15px 30px; background-color: #FF4667; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #666666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ تحديث الطلب</h1>
    </div>
    <div class="content">
      <h2>عزيزي ${name}</h2>
      <p>نشكرك على اهتمامك بالانضمام كمدرب في ForsaLearn.</p>
      <p>بعد مراجعة طلبك، للأسف لم يتم قبوله في الوقت الحالي للسبب التالي:</p>
      <div class="reason-box">
        <strong>السبب:</strong> ${reason}
      </div>
      <p>نشجعك على تحسين ملفك الشخصي وإعادة التقديم مرة أخرى.</p>
      <p style="text-align: center;">
        <a href="${process.env.CLIENT_URL}/formateur/reapply" class="button">إعادة التقديم</a>
      </p>
    </div>
    <div class="footer">
      <p>إذا كان لديك أي استفسار، يرجى التواصل معنا.</p>
    </div>
  </div>
</body>
</html>
`;

// Course Approval Template
const courseApprovalTemplate = (formateurName, courseTitle) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
    .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
    .course-box { background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .button { display: inline-block; padding: 15px 30px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ تم نشر الدورة</h1>
    </div>
    <div class="content">
      <h2>مبروك ${formateurName}!</h2>
      <p>تمت الموافقة على دورتك ونشرها على المنصة.</p>
      <div class="course-box">
        <strong>الدورة:</strong> ${courseTitle}
      </div>
      <p>دورتك الآن متاحة للطلاب ويمكنهم التسجيل فيها.</p>
      <p style="text-align: center;">
        <a href="${process.env.CLIENT_URL}/formateur/courses" class="button">إدارة دوراتي</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

// Course Rejection Template
const courseRejectionTemplate = (formateurName, courseTitle, reason) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
    .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
    .course-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .reason-box { background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📝 تحديث على الدورة</h1>
    </div>
    <div class="content">
      <h2>عزيزي ${formateurName}</h2>
      <p>تم مراجعة دورتك من قبل الإدارة:</p>
      <div class="course-box">
        <strong>الدورة:</strong> ${courseTitle}
      </div>
      <p>للأسف، الدورة تحتاج بعض التحسينات قبل النشر:</p>
      <div class="reason-box">
        <strong>السبب:</strong> ${reason}
      </div>
      <p>يرجى تعديل الدورة وفقاً للملاحظات وإعادة إرسالها للمراجعة.</p>
    </div>
  </div>
</body>
</html>
`;

// Enrollment Confirmation Template
const enrollmentConfirmationTemplate = (studentName, courseTitle, formateurName) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #392C7D 0%, #FF4667 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
    .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
    .course-info { background-color: #e7f3ff; border-left: 4px solid #0056b3; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .button { display: inline-block; padding: 15px 30px; background-color: #FF4667; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 تأكيد التسجيل</h1>
    </div>
    <div class="content">
      <h2>مبروك ${studentName}!</h2>
      <p>تم تسجيلك بنجاح في الدورة التالية:</p>
      <div class="course-info">
        <strong>الدورة:</strong> ${courseTitle}<br>
        <strong>المدرب:</strong> ${formateurName}
      </div>
      <p>يمكنك الآن البدء بالتعلم والوصول لجميع دروس الدورة.</p>
      <p style="text-align: center;">
        <a href="${process.env.CLIENT_URL}/my-courses" class="button">بدء التعلم</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

// Password Reset Template
const passwordResetTemplate = (name, resetLink) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #392C7D 0%, #FF4667 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
    .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
    .button { display: inline-block; padding: 15px 30px; background-color: #FF4667; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
    .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 إعادة تعيين كلمة المرور</h1>
    </div>
    <div class="content">
      <h2>مرحباً ${name}</h2>
      <p>تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك.</p>
      <p style="text-align: center;">
        <a href="${resetLink}" class="button">إعادة تعيين كلمة المرور</a>
      </p>
      <div class="warning">
        <strong>تنبيه:</strong> هذا الرابط صالح لمدة ساعة واحدة فقط.
      </div>
      <p style="color: #666; font-size: 14px;">
        إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد.
      </p>
    </div>
  </div>
</body>
</html>
`;

// EXPORTS

module.exports = {
  sendEmail,
  welcomeEmailTemplate,
  verificationEmailTemplate,
  formateurApprovalTemplate,
  formateurRejectionTemplate,
  courseApprovalTemplate,
  courseRejectionTemplate,
  enrollmentConfirmationTemplate,
  passwordResetTemplate
};