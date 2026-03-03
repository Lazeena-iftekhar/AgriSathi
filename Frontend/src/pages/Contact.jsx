import React, { useState, useEffect } from "react";
import "./contactus.css";

import image1 from "../assets/Lazeena1.jpeg";
import image2 from "../assets/KhushiGupta.jpeg";
import image3 from "../assets/JasmineImage.jpeg";
import image4 from "../assets/Anchal.jpeg"


const Contact = () => {
  const teamMembers = [
    {
      name: "Lazeena Iftekhar",
      role: "AI Model Development",
      social: {
        linkedin: "https://www.linkedin.com/in/lazeena-iftekhar",
        github: "https://github.com/Lazeena-iftekhar",
      },
    },
    {
      name: "Khushi Gupta",
      role: "Backend Development ",
      social: {
        linkedin: "https://www.linkedin.com/in/khushi-gupta-a57b3a25a",
        github: "https://github.com/KHU-SHIGUPTA",
      },
    },
    {
      name: "Jasmine Rai",
      role: "UI/UX Design & Frontend Developmentt",
      social: {
        linkedin: "https://www.linkedin.com/in/jasmine-rai-6a422427b",
        github: "https://github.com/Assistantjasmine282",
      },
    },
    {
      name: "Anchal Gupta",
      role: "UI/UX & Documentation",
      social: {
        linkedin: "https://www.linkedin.com/in/prachi-aggarwal-12096a360/",
        github: "https://github.com/prachiagg06",
      },
    },
  ];

  const images = [image1, image2, image3, image4];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const updateCarousel = (newIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const adjustedIndex = (newIndex + teamMembers.length) % teamMembers.length;
    setCurrentIndex(adjustedIndex);
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > swipeThreshold) {
      updateCarousel(currentIndex + (diff > 0 ? 1 : -1));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        updateCarousel(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        updateCarousel(currentIndex + 1);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex]);

  const getCarddClass = (index) => {
    const offset =
      (index - currentIndex + teamMembers.length) % teamMembers.length;
    if (offset === 0) return "cardd center";
    if (offset === 1) return "cardd right-1";
    if (offset === teamMembers.length - 1) return "cardd left-1";
    return "cardd hidden";
  };

  const SocialIcons = ({ social }) => (
    <div className="social-icons-container">
      {social.linkedin && (
        <a
          href={social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon linkedin-icon"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.2 8h4.6v12H.2V8zM7.8 8h4.4v1.7h.1c.6-1.1 2.1-2.3 4.3-2.3 4.6 0 5.4 3 5.4 6.9v8.7h-4.6v-7.7c0-1.9 0-4.4-2.7-4.4-2.7 0-3.1 2.1-3.1 4.3v7.8H7.8V8z" />
          </svg>
        </a>
      )}
      {social.github && (
        <a
          href={social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon github-icon"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.29 3.438 9.79 8.207 11.387.6.113.793-.258.793-.577v-2.234c-3.338.726-4.033-1.61-4.033-1.61-.546-1.387-1.334-1.757-1.334-1.757-1.09-.745.082-.73.082-.73 1.205.082 1.838 1.24 1.838 1.24 1.07 1.835 2.807 1.305 3.492.997.107-.775.42-1.305.762-1.604-2.665-.305-5.466-1.332-5.466-5.933 0-1.31.467-2.382 1.235-3.222-.123-.305-.535-1.527.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.65.242 2.872.12 3.176.77.84 1.233 1.912 1.233 3.222 0 4.61-2.803 5.625-5.475 5.922.432.372.816 1.102.816 2.222v3.293c0 .32.19.694.8.576C20.565 22.29 24 17.79 24 12.5 24 5.87 18.63.5 12 .5z" />
          </svg>
        </a>
      )}
    </div>
  );

  return (
    <div className="contact-container">
      <div className="heading-info-contact">
        <h1 className="about-title">THE DEVELOPERS</h1>
      </div>

      <div className="carousel-container">
        <button
          className="nav-arrow left"
          onClick={() => updateCarousel(currentIndex - 1)}
        >
          ‹
        </button>
        <div className="carousel-track">
          {images.map((image, index) => (
            <div
              key={index}
              className={getCarddClass(index)}
              onClick={() => updateCarousel(index)}
              onTouchStart={(e) => setTouchStartX(e.changedTouches[0].screenX)}
              onTouchEnd={(e) => {
                setTouchEndX(e.changedTouches[0].screenX);
                handleSwipe();
              }}
            >
              <img src={image} alt={`Team Member ${index + 1}`} />

            </div>
          ))}
        </div>
        <button
          className="nav-arrow right"
          onClick={() => updateCarousel(currentIndex + 1)}
        >
          ›
        </button>
      </div>

      <div className="member-info">
        <h2 className="member-name">{teamMembers[currentIndex].name}</h2>
        <p className="member-role">{teamMembers[currentIndex].role}</p>
        <SocialIcons social={teamMembers[currentIndex].social} />
      </div>

      <div className="dots">
        {teamMembers.map((_, index) => (
          <div
            key={index}
          className={`dot ${index === currentIndex ? "active" : ""}`}

            onClick={() => updateCarousel(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Contact;