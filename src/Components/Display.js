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
  });

  const updateDetails = (newDetails) => {
    setUserDetails(newDetails);
  };

  // to display predicted food items.
  const [foodDetails, setfoodDetails] = useState({
    total_calories_taken: 0,
    class_name: '',
    score: 0,
    calorie: 0,
  });

  const updatefoodDetails = (newfoodDetails) => {
    setfoodDetails(newfoodDetails);
  };

  const [showFoodDetails, setShowFoodDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:4000/getUserDetails");
        // Assuming the server returns an object with user details
        console.log(response.data);
        updateDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    // Fetch user details when the component mounts
    fetchData();
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  // a function that makes a get request to NodeJS server using Axios
  const handleUseDeviceClick = async () => {
    try {
      const deviceResponse = await axios.get("http://127.0.0.1:4000/getDeviceInfo");
      console.log(deviceResponse.data);
      updatefoodDetails(deviceResponse.data);
      setShowFoodDetails(true); // Show food details after button click
    } catch (error) {
      console.error('Error fetching device information:', error);
    }
  };

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
          Total calories you have consumed today: {foodDetails.total_calories_taken}
        </p>
        <button className="secondary-button" onClick={handleUseDeviceClick}>
          Use Device
        </button>
        {showFoodDetails && (
          <div>
            <p className="primary-text">
              The identified food item is: {foodDetails.class_name}
            </p>
            <p className="primary-text">
              The probability is : {foodDetails.score}
            </p>
            <p className="primary-text">
              The calorie is : {foodDetails.calorie}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Display;
