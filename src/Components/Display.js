import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./Navbar";
import BannerBackground from "../Assets/home-banner-background.png";
import test from "../Assets/test.jpg";

const Display = () => {
  // State for user details
  const [userDetails, setUserDetails] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    calorieGoalPerDay: '',
    dailyLogs: []
  });

  // State for BMI value
  const [bmi, setBMI] = useState(null);

  // State for food details
  const [foodDetails, setFoodDetails] = useState({
    total_calories_taken: 0,
    instances: [],
  });

  // State for showing food details
  const [showFoodDetails, setShowFoodDetails] = useState(false);

  // State for daily logs
  const [dailyLogs, setDailyLogs] = useState([]);

  // Function to update user details
  const updateDetails = (newDetails) => {
    setUserDetails(newDetails);
  };

  // Function to update food details
  const updateFoodDetails = (newFoodDetails) => {
    setFoodDetails(newFoodDetails);
  };

  // Function to update daily logs
  const updateDailyLogs = (newDailyLogs) => {
    setDailyLogs(newDailyLogs);
  };

  // Fetch user details and daily logs from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userDetailsResponse = await axios.get("http://127.0.0.1:4000/getUserDetails");
        updateDetails(userDetailsResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Calculate BMI when userDetails.height and userDetails.weight change
  useEffect(() => {
    if (userDetails.height && userDetails.weight) {
      const heightInMeter = userDetails.height / 100; // Convert height to meters
      const weightInKg = userDetails.weight;
      const bmiValue = weightInKg / (heightInMeter * heightInMeter);
      setBMI(bmiValue.toFixed(2)); // Round BMI value to two decimal places
    }
  }, [userDetails]);

  // Function to handle click on "Use Device" button
  const handleUseDeviceClick = async () => {
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams({
        dateTime: new Date().toISOString() // Assuming current date-time
      });

      // Construct the URL with query parameters
      const url = `http://127.0.0.1:4000/getDeviceInfo?${queryParams}`;

      // Make the request with query parameters
      const deviceResponse = await axios.get(url);

      // Update food details state with the detected instances
      updateFoodDetails(deviceResponse.data);

      // Show the food details
      setShowFoodDetails(true);


      // Fetch user details again to update the daily logs
      const userDetailsResponse = await axios.get("http://127.0.0.1:4000/getUserDetails");
      updateDetails(userDetailsResponse.data);

    } catch (error) {
      console.error('Error fetching device information:', error);
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="about-section-text-container">
          <div className='display-box-container'>
            <div className="display-box">
              <h1 className="display-heading">User Details</h1>
              <div className="display-details">
                <p>Name:  {userDetails.name}</p>
                <p>Age:{userDetails.age}</p>
                <p>Body Mass Index(BMI):{bmi}</p>
                <p><strong>Calorie Goal Per Day:</strong> {userDetails.calorieGoalPerDay}</p>
              </div>
            </div>
            <div className="display-box">
              <h1 className="display-heading">Daily Logs</h1>
              <div className="display-details">
                {/* Filter out daily logs with the same date */}
                {userDetails.dailyLogs.filter((log, index, self) =>
                  index === self.findIndex((l) => (
                    new Date(l.day).toLocaleDateString() === new Date(log.day).toLocaleDateString()
                  ))
                ).map((log, index) => (
                  <div key={index} className="log-item">
                    <p><strong>Date:</strong> {new Date(log.day).toLocaleDateString()}</p>
                    <p><strong>Total Calories:</strong> {log.totalCalories}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="secondary-button" onClick={handleUseDeviceClick}>
            Use Device
          </button>

          {showFoodDetails && (
            <div className="about-section-text-container">
              <h1>Detected Food Instances</h1>
                <img src={test} alt="Alternate " style={{ height: '200px', width: '200px', objectFit: 'cover', display: 'block', margin: '0 auto', marginTop: '20px', marginBottom: '20px' }} />
              <div className='display-box-container' >
                {foodDetails.instances.map((instance, index) => (
                  <div key={index} className="display-box">
                  <div className='display-details'> 
                    <p><strong>Food Name:</strong> {instance.foodName}</p>
                    <p><strong>Calories:</strong> {instance.calories}</p>
                    {/* Display serving for each food item */}
                    <p><strong>Portion Size: </strong> {instance.serving}</p>
                    {/* Display individual food items */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Display;
