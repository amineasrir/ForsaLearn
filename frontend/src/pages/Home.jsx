
import Categories from "../components/home_c/Categories";
import Courses from "../components/home_c/Courses";
import "../styles/home.css";
import SkillsSection from "../components/home_c/SkillsSection";
import Mentor from "../components/home_c/Mentor";
import Navbar from "../components/home_c/Navbar";
import Hero from "../components/home_c/Hero";
import Blog from "../components/home_c/Blog";
import Footer from "../components/home_c/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <div id="hero"><Hero /></div>
      <SkillsSection/>
      <Categories />
      <div id="courses"><Courses /></div>
      <div id="blog"><Blog /></div>
      <Mentor />
      <div id="footer"><Footer /></div>
     
      
      
      
   
    </>
  );
};

export default Home;
