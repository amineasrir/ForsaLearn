
import Categories from "../components/home_c/Categories";
import Courses from "../components/home_c/Courses";
import "../styles/home.css";
import SkillsSection from "../components/home_c/SkillsSection";
import Mentor from "../components/home_c/Mentor";
import Navbar from "../components/home_c/Navbar";
import Hero from "../components/home_c/Hero";
import Blog from "../components/home_c/Blog";
import Testimonials from "../components/home_c/Testimonials";
import Footer from "../components/home_c/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
       <SkillsSection/>
       <Categories />
       <Courses />
      <Blog />
      <Mentor />
      <Testimonials />
      <Footer />
     
      
      
      
   
    </>
  );
};

export default Home;
