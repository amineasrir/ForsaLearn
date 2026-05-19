import image1 from "../../assets/image/home_page/image1.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <section className="hero-h">
      <div className="hero-text">
        <button className="btn1" onClick={handleGetStarted}>{t("homePage.hero.leader")}</button>
        <h1>
          {t("homePage.hero.engaging")} <span>&</span> {t("homePage.hero.accessible")} <br />
          {t("homePage.hero.courses_for_all")}
        </h1>
        <p>{t("homePage.hero.lead")}</p>
      </div>

      <div className="hero-img">
        <img src={image1} alt="student" />
      </div>
    </section>
  );
};

export default Hero;
