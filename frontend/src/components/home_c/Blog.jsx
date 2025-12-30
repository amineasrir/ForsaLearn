import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faClock, faCertificate } from "@fortawesome/free-solid-svg-icons";
import imgA from "../../assets/image/home_page/image4.png";
import imgB from "../../assets/image/home_page/image5.png";
import imgC from "../../assets/image/home_page/image6.png";
import imgD from "../../assets/image/home_page/image7.png";
import imgE from "../../assets/image/home_page/image8.png";
import imgF from "../../assets/image/home_page/image9.png";

const Feature = ({ title, semi_title, bullets, image, reverse, icon, colorClass }) => (
    <section className={`feature-section ${reverse ? "reverse" : ""} ${colorClass || ""}`}>
        <div className="feature-image">
            <div className="image-card large">
                <img src={image[0]} alt="feature" />
            </div>
            {image[1] && (
                <div className="image-card small">
                    <img src={image[1]} alt="feature small" className="img1" />
                </div>
            )}
        </div>

        <div className="feature-content">
            <div className="feature-icon" aria-hidden="true">
                {icon && <FontAwesomeIcon icon={icon} />}
            </div>
            <h3>{title}</h3>
            <p className="lead">
                 {semi_title}
            </p>
            <ul className="feature-bullets">
                {bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                ))}
            </ul>
        </div>
    </section>
);

const Blog = () => {
    const features = [
        {
            title: "Award Winning Course Management",
            semi_title: "An award-winning course management system (CMS) or program is typically recognized for its exceptional quality, innovation, and effectiveness in helping both instructors and students succeed.",
            bullets: [
                "Interactive Tools for Engagement",
                "Customizable Course Creation",
                "Robust Analytics and Reporting",
                "Collaborative and Peer-to-Peer Learning",
                "The Most World Class Instructors",
            ],
            image: [imgA, imgB],
            icon: faTrophy,
        },
        {
            title: "Learn anything from anywhere anytime",
            semi_title: "In today's fast-paced, digital world, the ability to learn anything, from anywhere, and at any time is more accessible than ever. Whether you are looking to expand your knowledge, gain new skills.",
            bullets: [
                "Access to a World of Knowledge",
                "Diverse Learning Formats",
                "Learn at Your Own Pace",
                "Affordable and Flexible Pricing",
                "Learning from Anywhere",
            ],
            image: [imgC, imgD],
            icon: faClock,
        },
        {
            title: "Certification for solid development of your Career",
            semi_title: "Certifications are a powerful way to enhance your skills, build credibility, and boost your career growth. In today's competitive job market, a professional certification",
            bullets: [
                "Demonstrates Expertise",
                "Boosts Your Credibility",
                "Improves Job Security",
                "Facilitates Career Advancement",
                "Fosters Personal Growth",
            ],
            image: [imgE, imgF],
            icon: faCertificate,
        },
    ];

    return (
        <main className="blog-page">
            {features.map((f, idx) => {
                const colorClass = idx === 0 ? "accent-yellow" : idx === 1 ? "accent-teal" : "accent-green";
                return (
                    <Feature
                        key={idx}
                        title={f.title}
                        semi_title={f.semi_title}
                        bullets={f.bullets}
                        image={f.image}
                        reverse={idx % 2 === 1}
                        icon={f.icon}
                        colorClass={colorClass}
                    />
                );
            })}
        </main>
    );
};

export default Blog;