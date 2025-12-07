// Multi-language email templates (English & French)

const getTranslations = (language = 'en') => ({
    en: {
      welcome: {
        subject: 'Welcome to ForsaLearn 🎓',
        title: 'Welcome to ForsaLearn',
        greeting: (name) => `Hello ${name}!`,
        intro: 'We are excited to have you join ForsaLearn learning platform.',
        features: [
          'Access hundreds of educational courses',
          'Learn from the best instructors',
          'Get certified certificates',
          'Connect with the learning community'
        ],
        button: 'Start Learning Now',
        footer: 'If you have any questions, feel free to contact us.',
        signature: 'Best wishes,<br>ForsaLearn Team'
      },
      verification: {
        subject: 'Activate Your Account ✉️',
        title: 'Account Activation',
        intro: 'Thank you for registering. Please activate your account:',
        button: 'Activate Account',
        note: '<strong>Note:</strong> This link is valid for 24 hours only.'
      },
      formateurApproval: {
        subject: '🎉 Your Instructor Account is Approved',
        title: 'Approved!',
        greeting: (name) => `Congratulations ${name}!`,
        intro: 'Your instructor account has been approved.',
        features: [
          'Create new courses',
          'Manage your content',
          'Interact with students',
          'Track your earnings'
        ],
        button: 'Go to Dashboard'
      },
      formateurRejection: {
        subject: '⚠️ Application Update',
        title: 'Application Review',
        intro: 'Thank you for your interest. Unfortunately, your application was not accepted at this time.',
        reasonLabel: 'Reason:',
        encouragement: 'We encourage you to improve your profile and reapply.',
        button: 'Reapply'
      },
      courseApproval: {
        subject: '✅ Your Course is Published',
        title: 'Course Published!',
        intro: 'Your course has been approved and published.',
        courseLabel: 'Course:',
        message: 'Your course is now available for students.',
        button: 'Manage Courses'
      },
      courseRejection: {
        subject: '📝 Course Review Update',
        title: 'Course Needs Improvement',
        intro: 'Your course has been reviewed and needs some improvements:',
        reasonLabel: 'Feedback:',
        action: 'Please make the necessary changes and resubmit.'
      },
      enrollment: {
        subject: (courseTitle) => `🎓 Enrolled in ${courseTitle}`,
        title: 'Enrollment Confirmation',
        greeting: (name) => `Congratulations ${name}!`,
        intro: 'You have successfully enrolled in:',
        courseLabel: 'Course:',
        instructorLabel: 'Instructor:',
        message: 'You can now access all course lessons.',
        button: 'Start Learning'
      },
      newStudent: {
        subject: (courseTitle) => `🎉 New Student in ${courseTitle}`,
        title: 'New Student!',
        intro: 'A new student has enrolled in your course:',
        studentLabel: 'Student:',
        courseLabel: 'Course:',
        totalLabel: (total) => `Total enrolled: ${total}`,
        button: 'View Students'
      },
      passwordReset: {
        subject: '🔒 Reset Your Password',
        title: 'Password Reset',
        intro: 'We received a request to reset your password.',
        button: 'Reset Password',
        warning: '<strong>Warning:</strong> This link is valid for 1 hour only.',
        ignore: 'If you didn\'t request this, please ignore this email.'
      },
      courseCompletion: {
        subject: (courseTitle) => `🏆 You Completed ${courseTitle}!`,
        title: 'Congratulations!',
        greeting: (name) => `Well done ${name}!`,
        intro: 'You have completed:',
        message: 'Your certificate is ready for download!',
        button: 'Download Certificate',
        footer: 'We wish you success in your learning journey! 🎓'
      },
      reminder: {
        subject: (courseTitle) => `⏰ Don't Forget ${courseTitle}`,
        title: 'We Miss You!',
        intro: (courseTitle, days) => `You haven't accessed <strong>${courseTitle}</strong> for ${days} days.`,
        encouragement: 'Don\'t forget to continue learning to achieve your goals! 💪',
        progress: (progress) => `Current progress: <strong>${progress}%</strong>`,
        button: 'Continue Learning'
      }
    },
    fr: {
      welcome: {
        subject: 'Bienvenue sur ForsaLearn 🎓',
        title: 'Bienvenue sur ForsaLearn',
        greeting: (name) => `Bonjour ${name}!`,
        intro: 'Nous sommes ravis de vous accueillir sur ForsaLearn.',
        features: [
          'Accéder à des centaines de cours',
          'Apprendre des meilleurs instructeurs',
          'Obtenir des certificats reconnus',
          'Rejoindre la communauté d\'apprenants'
        ],
        button: 'Commencer à Apprendre',
        footer: 'Si vous avez des questions, n\'hésitez pas à nous contacter.',
        signature: 'Cordialement,<br>L\'équipe ForsaLearn'
      },
      verification: {
        subject: 'Activez Votre Compte ✉️',
        title: 'Activation du Compte',
        intro: 'Merci de vous être inscrit. Veuillez activer votre compte:',
        button: 'Activer le Compte',
        note: '<strong>Note:</strong> Ce lien n\'est valable que 24 heures.'
      },
      formateurApproval: {
        subject: '🎉 Votre Compte Instructeur est Approuvé',
        title: 'Approuvé!',
        greeting: (name) => `Félicitations ${name}!`,
        intro: 'Votre compte instructeur a été approuvé.',
        features: [
          'Créer de nouveaux cours',
          'Gérer votre contenu',
          'Interagir avec les étudiants',
          'Suivre vos revenus'
        ],
        button: 'Accéder au Tableau de Bord'
      },
      formateurRejection: {
        subject: '⚠️ Mise à Jour de la Candidature',
        title: 'Examen de la Candidature',
        intro: 'Merci de votre intérêt. Malheureusement, votre candidature n\'a pas été acceptée pour le moment.',
        reasonLabel: 'Raison:',
        encouragement: 'Nous vous encourageons à améliorer votre profil et à postuler à nouveau.',
        button: 'Postuler à Nouveau'
      },
      courseApproval: {
        subject: '✅ Votre Cours est Publié',
        title: 'Cours Publié!',
        intro: 'Votre cours a été approuvé et publié.',
        courseLabel: 'Cours:',
        message: 'Votre cours est maintenant disponible pour les étudiants.',
        button: 'Gérer les Cours'
      },
      courseRejection: {
        subject: '📝 Mise à Jour du Cours',
        title: 'Le Cours Nécessite des Améliorations',
        intro: 'Votre cours a été examiné et nécessite quelques améliorations:',
        reasonLabel: 'Commentaires:',
        action: 'Veuillez apporter les modifications nécessaires et soumettre à nouveau.'
      },
      enrollment: {
        subject: (courseTitle) => `🎓 Inscrit à ${courseTitle}`,
        title: 'Confirmation d\'Inscription',
        greeting: (name) => `Félicitations ${name}!`,
        intro: 'Vous vous êtes inscrit avec succès à:',
        courseLabel: 'Cours:',
        instructorLabel: 'Instructeur:',
        message: 'Vous pouvez maintenant accéder à toutes les leçons.',
        button: 'Commencer à Apprendre'
      },
      newStudent: {
        subject: (courseTitle) => `🎉 Nouvel Étudiant dans ${courseTitle}`,
        title: 'Nouvel Étudiant!',
        intro: 'Un nouvel étudiant s\'est inscrit à votre cours:',
        studentLabel: 'Étudiant:',
        courseLabel: 'Cours:',
        totalLabel: (total) => `Total inscrit: ${total}`,
        button: 'Voir les Étudiants'
      },
      passwordReset: {
        subject: '🔒 Réinitialiser Votre Mot de Passe',
        title: 'Réinitialisation du Mot de Passe',
        intro: 'Nous avons reçu une demande de réinitialisation de votre mot de passe.',
        button: 'Réinitialiser le Mot de Passe',
        warning: '<strong>Attention:</strong> Ce lien n\'est valable qu\'1 heure.',
        ignore: 'Si vous n\'avez pas demandé cela, veuillez ignorer cet email.'
      },
      courseCompletion: {
        subject: (courseTitle) => `🏆 Vous Avez Terminé ${courseTitle}!`,
        title: 'Félicitations!',
        greeting: (name) => `Bravo ${name}!`,
        intro: 'Vous avez terminé:',
        message: 'Votre certificat est prêt à être téléchargé!',
        button: 'Télécharger le Certificat',
        footer: 'Nous vous souhaitons du succès dans votre parcours d\'apprentissage! 🎓'
      },
      reminder: {
        subject: (courseTitle) => `⏰ N'Oubliez Pas ${courseTitle}`,
        title: 'Vous Nous Manquez!',
        intro: (courseTitle, days) => `Vous n'avez pas accédé à <strong>${courseTitle}</strong> depuis ${days} jours.`,
        encouragement: 'N\'oubliez pas de continuer à apprendre pour atteindre vos objectifs! 💪',
        progress: (progress) => `Progrès actuel: <strong>${progress}%</strong>`,
        button: 'Continuer à Apprendre'
      }
    }
  }[language] || {});
  
  module.exports = { getTranslations };