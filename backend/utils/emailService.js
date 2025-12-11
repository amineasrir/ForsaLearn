const { sendEmail } = require('../config/email');
const { getTranslations } = require('../config/emailTemplates');

// Base email template
const baseTemplate = (content, language = 'en') => `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #392C7D 0%, #FF4667 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
    .header.success { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); }
    .header.warning { background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); }
    .header.danger { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); }
    .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
    .button { display: inline-block; padding: 15px 30px; background-color: #FF4667; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; color: #666666; font-size: 14px; }
  </style>
</head>
<body>${content}</body>
</html>
`;

// WELCOME EMAIL

const sendWelcomeEmail = async (user, language = 'en') => {
  try {
    const t = getTranslations(language).welcome;
    
    const html = baseTemplate(`
      <div class="container">
        <div class="header">
          <h1>🎓 ForsaLearn</h1>
        </div>
        <div class="content">
          <h2>${t.greeting(user.firstName)}</h2>
          <p>${t.intro}</p>
          <ul>${t.features.map(f => `<li>${f}</li>`).join('')}</ul>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL}" class="button">${t.button}</a>
          </p>
          <p>${t.footer}</p>
          <p>${t.signature}</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 ForsaLearn. All rights reserved.</p>
        </div>
      </div>
    `, language);
    
    await sendEmail({ to: user.email, subject: t.subject, html });
    console.log(`✅ Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
  }
};

// FORMATEUR APPROVAL/REJECTION

const sendFormateurApprovalEmail = async (formateur, language = 'en') => {
  try {
    const t = getTranslations(language).formateurApproval;
    
    const html = baseTemplate(`
      <div class="container">
        <div class="header success">
          <h1>🎉 ${t.title}</h1>
        </div>
        <div class="content">
          <h2>${t.greeting(formateur.firstName)}</h2>
          <p>${t.intro}</p>
          <ul>${t.features.map(f => `<li>${f}</li>`).join('')}</ul>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/formateur/dashboard" class="button">${t.button}</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2024 ForsaLearn</p>
        </div>
      </div>
    `, language);
    
    await sendEmail({ to: formateur.email, subject: t.subject, html });
    console.log(`✅ Approval email sent to ${formateur.email}`);
  } catch (error) {
    console.error('❌ Error sending approval email:', error);
  }
};

const sendFormateurRejectionEmail = async (formateur, reason, language = 'en') => {
  try {
    const t = getTranslations(language).formateurRejection;
    
    const html = baseTemplate(`
      <div class="container">
        <div class="header danger">
          <h1>⚠️ ${t.title}</h1>
        </div>
        <div class="content">
          <p>${t.intro}</p>
          <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <strong>${t.reasonLabel}</strong> ${reason}
          </div>
          <p>${t.encouragement}</p>
        </div>
      </div>
    `, language);
    
    await sendEmail({ to: formateur.email, subject: t.subject, html });
    console.log(`✅ Rejection email sent to ${formateur.email}`);
  } catch (error) {
    console.error('❌ Error sending rejection email:', error);
  }
};

// COURSE APPROVAL/REJECTION

const sendCourseApprovalEmail = async (course, formateur, language = 'en') => {
  try {
    const t = getTranslations(language).courseApproval;
    
    const html = baseTemplate(`
      <div class="container">
        <div class="header success">
          <h1>✅ ${t.title}</h1>
        </div>
        <div class="content">
          <p>${t.intro}</p>
          <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <strong>${t.courseLabel}</strong> ${course.title}
          </div>
          <p>${t.message}</p>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/formateur/courses" class="button">${t.button}</a>
          </p>
        </div>
      </div>
    `, language);
    
    await sendEmail({ to: formateur.email, subject: t.subject, html });
    console.log(`✅ Course approval email sent to ${formateur.email}`);
  } catch (error) {
    console.error('❌ Error sending course approval email:', error);
  }
};

const sendCourseRejectionEmail = async (course, formateur, reason, language = 'en') => {
  try {
    const t = getTranslations(language).courseRejection;
    
    const html = baseTemplate(`
      <div class="container">
        <div class="header warning">
          <h1>📝 ${t.title}</h1>
        </div>
        <div class="content">
          <p>${t.intro}</p>
          <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <strong>${t.reasonLabel}</strong> ${reason}
          </div>
          <p>${t.action}</p>
        </div>
      </div>
    `, language);
    
    await sendEmail({ to: formateur.email, subject: t.subject, html });
    console.log(`✅ Course rejection email sent to ${formateur.email}`);
  } catch (error) {
    console.error('❌ Error sending course rejection email:', error);
  }
};

// ENROLLMENT CONFIRMATION

const sendEnrollmentConfirmationEmail = async (student, course, formateur, language = 'en') => {
  try {
    const t = getTranslations(language).enrollment;
    
    const html = baseTemplate(`
      <div class="container">
        <div class="header">
          <h1>🎓 ${t.title}</h1>
        </div>
        <div class="content">
          <h2>${t.greeting(student.firstName)}</h2>
          <p>${t.intro}</p>
          <div style="background-color: #e7f3ff; border-left: 4px solid #0056b3; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <strong>${t.courseLabel}</strong> ${course.title}<br>
            <strong>${t.instructorLabel}</strong> ${formateur.firstName} ${formateur.lastName}
          </div>
          <p>${t.message}</p>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/my-courses" class="button">${t.button}</a>
          </p>
        </div>
      </div>
    `, language);
    
    await sendEmail({ to: student.email, subject: t.subject(course.title), html });
    console.log(`✅ Enrollment confirmation sent to ${student.email}`);
  } catch (error) {
    console.error('❌ Error sending enrollment confirmation:', error);
  }
};

// NEW STUDENT NOTIFICATION

const sendNewStudentNotification = async (formateur, student, course, language = 'en') => {
  try {
    const t = getTranslations(language).newStudent;
    
    const html = baseTemplate(`
      <div class="container">
        <div class="header">
          <h1>🎉 ${t.title}</h1>
        </div>
        <div class="content">
          <p>${t.intro}</p>
          <div style="background-color: #e7f3ff; border-left: 4px solid #0056b3; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <strong>${t.studentLabel}</strong> ${student.firstName} ${student.lastName}<br>
            <strong>${t.courseLabel}</strong> ${course.title}
          </div>
          <p>${t.totalLabel(course.totalEnrollments)}</p>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/formateur/courses/${course._id}/students" class="button">${t.button}</a>
          </p>
        </div>
      </div>
    `, language);
    
    await sendEmail({ to: formateur.email, subject: t.subject(course.title), html });
    console.log(`✅ New student notification sent to ${formateur.email}`);
  } catch (error) {
    console.error('❌ Error sending new student notification:', error);
  }
};

// Additional email functions can be added similarly...

// COURSE COMPLETION EMAIL

const sendCourseCompletionEmail = async (student, course, language = 'en') => {
  try {
    const t = getTranslations(language).courseCompletion;
    
    const html = baseTemplate(`
      <div class="container">
        <div class="header success">
          <h1>🏆 ${t.title}</h1>
        </div>
        <div class="content" style="text-align: center;">
          <div style="font-size: 80px; margin: 20px 0;">🏆</div>
          <h2>${t.greeting(student.firstName)}</h2>
          <p style="font-size: 18px;">${t.intro}</p>
          <h3 style="color: #28a745;">${course.title}</h3>
          <p>${t.message}</p>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/my-courses/${course._id}/certificate" class="button" style="background-color: #28a745;">${t.button}</a>
          </p>
          <p style="margin-top: 30px; color: #666;">${t.footer}</p>
        </div>
      </div>
    `, language);
    
    await sendEmail({ 
      to: student.email, 
      subject: t.subject(course.title), 
      html 
    });
    console.log(`✅ Course completion email sent to ${student.email}`);
  } catch (error) {
    console.error('❌ Error sending completion email:', error);
  }
};

const sendReminderEmail = async (student, course, daysInactive, progress, language = 'en') => {
  try {
    const t = getTranslations(language).reminder;
    const html = baseTemplate(`
      <div class="container">
        <div class="header warning">
          <h1>⏰ ${t.title}</h1>
        </div>
        <div class="content">
          <h2>${t.intro(course.title, daysInactive)}</h2>
          <p>${t.encouragement}</p>
          <p>${t.progress(progress)}</p>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/my-courses/${course._id}" class="button">${t.button}</a>
          </p>
        </div>
      </div>
    `, language);
    await sendEmail({ 
      to: student.email, 
      subject: t.subject(course.title),
      html 
    });
    console.log(`✅ Reminder email sent to ${student.email}`);
  } catch (error) {
    console.error('❌ Error sending reminder email:', error);
  }
};

const sendVerificationEmail = async (user, verificationLink, language = 'en') => {
  try {
    const t = getTranslations(language).verification;
    const html = baseTemplate(`
      <div class="container">
        <div class="header">
          <h1>✉️ ${t.title}</h1>
        </div>
        <div class="content">
          <p>${t.intro}</p>
          <p style="text-align: center;">
            <a href="${verificationLink}" class="button">${t.button}</a>
          </p>
          <p style="font-size: 12px; color: #888;">${t.note}</p>
        </div>
      </div>
    `, language);
    await sendEmail({ 
      to: user.email, 
      subject: t.subject,
      html 
    });
    console.log(`✅ Verification email sent to ${user.email}`);
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
  }
};

const sendPasswordResetEmail = async (user, resetLink, language = 'en') => {
  try {
    const t = getTranslations(language).passwordReset;
    const html = baseTemplate(`
      <div class="container">
        <div class="header">
          <h1>🔒 ${t.title}</h1>
        </div>
        <div class="content">
          <p>${t.intro}</p>
          <p style="text-align: center;">
            <a href="${resetLink}" class="button">${t.button}</a>
          </p>
          <p style="font-size: 12px; color: #888;">${t.note}</p>
        </div>
      </div>
    `, language);
    await sendEmail({
      to: user.email,
      subject: t.subject,
      html
    });
    console.log(`✅ Password reset email sent to ${user.email}`);
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendFormateurApprovalEmail,
  sendFormateurRejectionEmail,
  sendCourseApprovalEmail,
  sendCourseRejectionEmail,
  sendEnrollmentConfirmationEmail,
  sendNewStudentNotification,
  sendCourseCompletionEmail,
  sendReminderEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
};