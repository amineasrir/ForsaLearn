import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faClock, faCertificate } from "@fortawesome/free-solid-svg-icons";
import imgA from "../../assets/image/home_page/image4.png";
import imgB from "../../assets/image/home_page/image5.png";
import imgC from "../../assets/image/home_page/image6.png";
import imgD from "../../assets/image/home_page/image7.png";
import imgE from "../../assets/image/home_page/image8.png";
import imgF from "../../assets/image/home_page/image9.png";
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const features = t('homePage.blog.features', { returnObjects: true });

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
                        image={[imgA, imgB]} // images remain static
                        reverse={idx % 2 === 1}
                        icon={idx === 0 ? faTrophy : idx === 1 ? faClock : faCertificate}
                        colorClass={colorClass}
                    />
                );
            })}
        </main>
    );
};

export default Blog;