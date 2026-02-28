import i18n from "i18next";
import { initReactI18next } from "react-i18next";


i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        home: "Home",
        courses: "Courses",
        blog: "Blog",
        contact: "Contact",
        login: "Login",
        register: "Register",
        student: "Student",
        instructor: "Instructor",
        backToHome: "Back to Home",
        email: "Email",
        password: "Password",
        fullName: "Full Name",
        phone: "Phone",
        confirmPassword: "Confirm Password",
        rememberMe: "Remember Me",
        forgotPassword: "Forgot Password?",
        noAccount: "Don't you have an account?",
        signIn: "Sign in",
        signUp: "Sign up",
        signInTitle: "Sign into Your Account",
        signUpTitle: "Sign Up",
        agreeTerms: "I agree with",
        termsOfService: "Terms of Service",
        and: "and",
        privacyPolicy: "Privacy Policy",
        continue: "Continue",
        haveAccount: "Already you have an account?",
        formatterSignInTitle: "Instructor Sign In",
        formatterSignUpTitle: "Instructor Sign Up",
        specialty: "Specialty",
        skills: "Skills",
        projectLink: "Project Link",
        uploadCertification: "Upload Certification",
        bio: "Bio",
        professionalInfo: "Professional Information",
        previous: "Previous",
        
        // Password Reset
        forgotPasswordTitle: "Forgot Password?",
        forgotPasswordSubtitle: "Enter your email to reset your password.",
        submit: "Submit",
        rememberPassword: "Remember Password? Sign In",
        // OTP Verification
        emailOTP: "Email OTP",
        otpSent: "OTP sent to your Email Address:",
        verifyProceed: "Verify & Proceed",
        resendOTP: "Resend OTP",
        resendOTPIn: "Resend OTP in",
        enterValidOTP: "Please enter a valid OTP",
        // Set Password
        setPasswordTitle: "Set Password",
        setPasswordSubtitle: "Your new password must be different from previous password",
        resetPassword: "Reset Password",
        backToSignIn: "Back to Sign In",
        passwordsDontMatch: "Passwords do not match",
        passwordTooShort: "Password must be at least 6 characters long",
        // Welcome Back
        welcomeBack: "Welcome Back",
        enterPassword: "Enter your password",
        signInButton: "Sign In",
        useAnotherAccount: "Use a different account",
        passwordRequired: "Please enter your password",
        enterBothEmailPassword: "Please enter both email and password",
        // Error Messages
        pleaseEnterEmail: "Please enter your email",
        errorOccurred: "An error occurred. Please try again.",
        // FormatterSignUp
        allFieldsRequired: "Please fill in all professional information fields",
        homePage: {
          hero: {
            leader: "The Leader in Online Learning",
            engaging: "Engaging",
            accessible: "Accessible",
            courses_for_all: "online courses for all",
            lead: "Our specialized online courses are designed to bring the classroom experience to you, no matter where you are."
          },
          skills: {
            title: "Master the skills to drive your career",
            lead: "Get certified, master modern tech skills, and level up your career whether you are starting out or a seasoned pro. 95% of eLearning learners report our hands-on content directly helped their careers.",
            feature1: "Get certified with 100+ certification courses",
            feature2: "Build skills your way, from labs to courses",
            feature3: "Stay motivated with engaging instructors",
            feature4: "Keep up with the latest in cloud technology"
          },
          categories: {
            title: "Choose Favourite Course From Top Category",
            cat1: "Python Development",
            cat2: "JavaScript Development",
            cat3: "PHP Development",
            cat4: "Laravel Development"
          },
          courses: {
            title: "Popular Courses",
            students: "{{count}} Students",
            view_all: "View all Courses"
          },
          blog: {
            features: [
              {
                title: "Award Winning Course Management",
                semi_title: "An award-winning course management system (CMS) or program is typically recognized for its exceptional quality, innovation, and effectiveness in helping both instructors and students succeed.",
                bullets: [
                  "Interactive Tools for Engagement",
                  "Customizable Course Creation",
                  "Robust Analytics and Reporting",
                  "Collaborative and Peer-to-Peer Learning",
                  "The Most World Class Instructors"
                ]
              },
              {
                title: "Learn anything from anywhere anytime",
                semi_title: "In today's fast-paced, digital world, the ability to learn anything, from anywhere, and at any time is more accessible than ever.",
                bullets: [
                  "Access to a World of Knowledge",
                  "Diverse Learning Formats",
                  "Learn at Your Own Pace",
                  "Affordable and Flexible Pricing",
                  "Learning from Anywhere"
                ]
              },
              {
                title: "Certification for solid development of your Career",
                semi_title: "Certifications are a powerful way to enhance your skills, build credibility, and boost your career growth.",
                bullets: [
                  "Demonstrates Expertise",
                  "Boosts Your Credibility",
                  "Improves Job Security",
                  "Facilitates Career Advancement",
                  "Fosters Personal Growth"
                ]
              }
            ]
          },
          mentor: {
            title: "Master the skills to drive your career",
            sub: "The right course, guided by an expert mentor, can provide invaluable insights, practical skills",
            feature1_title: "Stay motivated with instructors",
            feature1_text: "Stay motivated with engaging instructors on our platform, guiding you through every course.",
            feature2_title: "Get certified on courses",
            feature2_text: "Get certified, master modern tech skills, and level up your career whether you're starting.",
            feature3_title: "Build skills on your way",
            feature3_text: "Build skills your way with hands-on labs and immersive courses, tailored to fit.",
            join_title: "Want to share your knowledge? Join us a Mentor",
            join_lead: "High-definition video is video of higher resolution and quality than standard-definition.",
            checks: [
              "Access Your Class anywhere",
              "Flexible Course Plan",
              "Quality Assurance",
              "The Most World Class Instructors"
            ],
            read_more: "Read More"
          },
          testimonials: {
            eyebrow: "Check out these real reviews",
            title: "Users love us — Don't take it from us.",
            testimonial_text: "I really appreciated my mentor's insight, but sometimes I felt overwhelmed by the amount of information they provided.",
            promo1_title: "Become An Instructor",
            promo1_text: "Top instructors from around the world teach millions of students on Mentoring.",
            promo1_btn: "Register as Instructor",
            promo2_title: "Transform Access",
            promo2_text: "Create an account to receive our newsletter course promotions.",
            promo2_btn: "Register as student"
          },
          footer: {
            for_instructor: "For Instructor",
            for_student: "For Student",
            profile: "Profile",
            login: "Login",
            register: "Register",
            instructor: "Instructor",
            dashboard: "Dashboard",
            get_in_touch: "Get in touch",
            phone_number: "Phone Number",
            mail_address: "Mail Address",
            address: "Address",
            terms: "Terms & Policy",
            privacy: "Privacy Policy",
            rights: "All rights reserved."
          }
        }
      }
    },
    fr: {
      translation: {
        home: "Accueil",
        courses: "Formations",
        blog: "Blog",
        contact: "Contact",
        login: "Connexion",
        register: "S'inscrire",
        student: "Étudiant",
        instructor: "Instructeur",
        backToHome: "Retour à l'accueil",
        email: "Email",
        password: "Mot de passe",
        fullName: "Nom complet",
        phone: "Téléphone",
        confirmPassword: "Confirmer le mot de passe",
        rememberMe: "Se souvenir de moi",
        forgotPassword: "Mot de passe oublié?",
        noAccount: "Vous n'avez pas de compte?",
        signIn: "Se connecter",
        signUp: "S'inscrire",
        signInTitle: "Connectez-vous à votre compte",
        signUpTitle: "S'inscrire",
        agreeTerms: "J'accepte",
        termsOfService: "Conditions d'utilisation",
        and: "et",
        privacyPolicy: "Politique de confidentialité",
        continue: "Continuer",
        haveAccount: "Vous avez déjà un compte?",
        formatterSignInTitle: "Connexion Instructeur",
        formatterSignUpTitle: "S'inscrire comme Instructeur",
        specialty: "Spécialité",
        skills: "Compétences",
        projectLink: "Lien du projet",
        uploadCertification: "Télécharger la certification",
        bio: "Biographie",
        professionalInfo: "Informations Professionnelles",
        previous: "Précédent",
        // Réinitialisation du mot de passe
        forgotPasswordTitle: "Mot de passe oublié?",
        forgotPasswordSubtitle: "Entrez votre e-mail pour réinitialiser votre mot de passe.",
        submit: "Soumettre",
        rememberPassword: "Vous vous souvenez du mot de passe? Se connecter",
        // Vérification OTP
        emailOTP: "OTP par e-mail",
        otpSent: "OTP envoyé à votre adresse e-mail:",
        verifyProceed: "Vérifier et continuer",
        resendOTP: "Renvoyer OTP",
        resendOTPIn: "Renvoyer OTP dans",
        enterValidOTP: "Veuillez entrer un OTP valide",
        // Définir le mot de passe
        setPasswordTitle: "Définir le mot de passe",
        setPasswordSubtitle: "Votre nouveau mot de passe doit être différent du mot de passe précédent",
        resetPassword: "Réinitialiser le mot de passe",
        backToSignIn: "Retour à la connexion",
        passwordsDontMatch: "Les mots de passe ne correspondent pas",
        passwordTooShort: "Le mot de passe doit comporter au moins 6 caractères",
        // Bienvenue
        welcomeBack: "Bienvenue",
        enterPassword: "Entrez votre mot de passe",
        signInButton: "Se connecter",
        useAnotherAccount: "Utiliser un autre compte",
        passwordRequired: "Veuillez entrer votre mot de passe",
        enterBothEmailPassword: "Veuillez entrer à la fois l'e-mail et le mot de passe",
        // Messages d'erreur
        pleaseEnterEmail: "Veuillez entrer votre e-mail",
        errorOccurred: "Une erreur s'est produite. Veuillez réessayer.",
        // FormatterSignUp
        allFieldsRequired: "Veuillez remplir tous les champs d'informations professionnelles",
        homePage: {
          hero: {
            leader: "Leader de l'apprentissage en ligne",
            engaging: "Engageant",
            accessible: "Accessible",
            courses_for_all: "cours en ligne pour tous",
            lead: "Nos cours en ligne spécialisés sont conçus pour vous rapprocher de l'expérience en classe, où que vous soyez."
          },
          skills: {
            title: "Maîtrisez les compétences pour faire avancer votre carrière",
            lead: "Obtenez une certification, maîtrisez les compétences technologiques modernes et faites évoluer votre carrière que vous débutiez ou soyez un professionnel expérimenté. 95% des apprenants eLearning indiquent que notre contenu pratique a aidé leur carrière.",
            feature1: "Obtenez une certification avec plus de 100 cours",
            feature2: "Développez vos compétences à votre façon, des labs aux cours",
            feature3: "Restez motivé grâce à des instructeurs engageants",
            feature4: "Restez à jour avec les dernières technologies cloud"
          },
          categories: {
            title: "Choisissez votre cours préféré parmi les meilleures catégories",
            cat1: "Développement Python",
            cat2: "Développement JavaScript",
            cat3: "Développement PHP",
            cat4: "Développement Laravel"
          },
          courses: {
            title: "Cours Populaires",
            students: "{{count}} étudiants",
            view_all: "Voir tous les cours"
          },
          blog: {
            features: [
              {
                title: "Gestion de cours primée",
                semi_title: "Un système de gestion de cours primé (CMS) est reconnu pour sa qualité, son innovation et son efficacité à aider les instructeurs et les étudiants à réussir.",
                bullets: [
                  "Outils interactifs pour l'engagement",
                  "Création de cours personnalisable",
                  "Analyses et rapports robustes",
                  "Apprentissage collaboratif et entre pairs",
                  "Des instructeurs de classe mondiale"
                ]
              },
              {
                title: "Apprenez n'importe quoi de n'importe où, à tout moment",
                semi_title: "Dans le monde numérique d'aujourd'hui, la possibilité d'apprendre n'importe quoi, de n'importe où, à tout moment est plus accessible que jamais.",
                bullets: [
                  "Accès à un monde de connaissances",
                  "Formats d'apprentissage divers",
                  "Apprenez à votre rythme",
                  "Tarification abordable et flexible",
                  "Apprendre de n'importe où"
                ]
              },
              {
                title: "Certification pour un développement solide de votre carrière",
                semi_title: "Les certifications sont un moyen puissant d'améliorer vos compétences, d'accroître votre crédibilité et de dynamiser votre carrière.",
                bullets: [
                  "Démontre l'expertise",
                  "Renforce votre crédibilité",
                  "Améliore la sécurité de l'emploi",
                  "Facilite l'avancement professionnel",
                  "Favorise la croissance personnelle"
                ]
              }
            ]
          },
          mentor: {
            title: "Maîtrisez les compétences pour faire avancer votre carrière",
            sub: "Le bon cours, guidé par un mentor expert, peut fournir des idées précieuses et des compétences pratiques",
            feature1_title: "Restez motivé avec des instructeurs",
            feature1_text: "Restez motivé grâce à des instructeurs engageants sur notre plateforme.",
            feature2_title: "Obtenez une certification sur les cours",
            feature2_text: "Obtenez une certification, maîtrisez les compétences et faites évoluer votre carrière.",
            feature3_title: "Développez vos compétences à votre manière",
            feature3_text: "Développez vos compétences avec des labs pratiques et des cours immersifs.",
            join_title: "Vous voulez partager vos connaissances ? Rejoignez-nous en tant que Mentor",
            join_lead: "La vidéo haute définition offre une meilleure résolution et qualité que la définition standard.",
            checks: [
              "Accédez à vos cours n'importe où",
              "Plan de cours flexible",
              "Assurance qualité",
              "Des instructeurs de classe mondiale"
            ],
            read_more: "En savoir plus"
          },
          testimonials: {
            eyebrow: "Découvrez ces avis réels",
            title: "Ils nous aiment — Ne vous contentez pas de nous croire.",
            testimonial_text: "J'ai vraiment apprécié les conseils de mon mentor, mais parfois je me suis senti submergé par la quantité d'informations qu'il a fournies.",
            promo1_title: "Devenez un instructeur",
            promo1_text: "Les meilleurs instructeurs du monde enseignent à des millions d'étudiants.",
            promo1_btn: "S'inscrire en tant qu'instructeur",
            promo2_title: "Transformer l'accès",
            promo2_text: "Créez un compte pour recevoir nos promotions de cours par newsletter.",
            promo2_btn: "S'inscrire en tant qu'étudiant"
          },
          footer: {
            for_instructor: "Pour les instructeurs",
            for_student: "Pour les étudiants",
            profile: "Profil",
            login: "Connexion",
            register: "S'inscrire",
            instructor: "Instructeur",
            dashboard: "Tableau de bord",
            get_in_touch: "Contactez-nous",
            phone_number: "Numéro de téléphone",
            mail_address: "Adresse e-mail",
            address: "Adresse",
            terms: "Conditions & Politique",
            privacy: "Politique de confidentialité",
            rights: "Tous droits réservés."
          }
        }
      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;