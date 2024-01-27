import React, { useState, useEffect } from 'react';
import "../App.css";
import AboutBackground from "../Assets/about-background.png";
import axios from 'axios';


const Display = () => {

  // To display user details
  const [userDetails, setUserDetails] = useState({
    name: '',
    age: 0,
    calorie_intake_goal: 0,
    calories_taken: 0,
  });

  const updateDetails = (newDetails) => {
    setUserDetails(newDetails);
  };

  // To display food item
  const [deviceInfo, setDeviceInfo] = useState({
    // image: '',
    text: '',
  });


  const updateDeviceInfo = (newDeviceInfo) => {
    setDeviceInfo(newDeviceInfo);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/getUserDetails");
        // Assuming the server returns an object with user details
        updateDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    // Fetch user details when the component mounts
    fetchData();
  }, []); // Empty dependency array ensures useEffect runs only once on mount


  const handleUseDeviceClick = async () => {
    try {
      const deviceResponse = await axios.get("http://127.0.0.1:5000/getDeviceInfo");
      // Assuming the server returns an object with information
      updateDeviceInfo(deviceResponse.data);
    } catch (error) {
      console.error('Error fetching device information:', error);
    }
  };

  useEffect(() => {
    // Handle "Use Device" click
    handleUseDeviceClick();
  }, []); // Empty dependency array ensures useEffect runs only once on mount


  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-text-container">
        <p className="primary-subheading">Details</p>
        <h1 className="primary-heading">
          Hi {userDetails.name}
        </h1>
        <p className="primary-text">
          Your calorie intake goal : {userDetails.calorie_intake_goal}
        </p>
        <p className="primary-text">
          Total calories you have consumed today: {userDetails.calories_taken}
        </p>
        <button className="secondary-button" onClick={handleUseDeviceClick}>
          Use Device
        </button>
        <div>
          {/* <img src={deviceInfo.image} alt="Device Image" /> */}
          <p>{deviceInfo.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Display;
