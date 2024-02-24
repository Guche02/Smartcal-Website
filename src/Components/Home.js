import React from "react";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/home-banner-image.png";
import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";

// For routing inside webpage.
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

// to handle onclicking the button.
  const handleButtonClick = () => {
    // Navigate to the "/about" page
    navigate('/register');
  };

  return (
    <div>
      <Navbar />
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            Count your calories before you eat!
          </h1>
          <p className="primary-text">
            
          </p>
          <button className="secondary-button" onClick={handleButtonClick}> 
            Register Now!<FiArrowRight />{" "}
          </button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Home;
