import image1 from "../../assets/image/home_page/image1.png";
const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <button className="btn1">The Leader in Online Learning</button>
        <h1>
          Engaging <span>&</span> Accessible <br />
          online courses for all
        </h1>
        <p>
          Our specialized online courses are designed to bring the classroom experience to you,<br></br> no matter where you are.
        </p>
      </div>

      <div className="hero-img">
        <img src={image1} alt="student" />
      </div>
    </section>
  );
};

export default Hero;
