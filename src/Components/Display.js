import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./Navbar";

const Display = () => {
  const [userDetails, setUserDetails] = useState({});
  const [bmi, setBMI] = useState(null);
  const [showFoodDetails, setShowFoodDetails] = useState(false);
  const [foodDetails, setFoodDetails] = useState({
    total_calories_taken: 0,
    instances: [],
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Retrieve token from local storage
        const token = localStorage.getItem('token');

        // Include token in the request headers
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get("http://127.0.0.1:4000/getUserDetails", config);
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userDetails.height && userDetails.weight) {
      const heightInMeter = userDetails.height / 100;
      const weightInKg = userDetails.weight;
      const bmiValue = weightInKg / (heightInMeter * heightInMeter);
      setBMI(bmiValue.toFixed(2));
    }
  }, [userDetails]);


  // Function to update user details
  const updateDetails = (newDetails) => {
    setUserDetails(newDetails);
  };

  const handleUseDeviceClick = async () => {
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams({
        dateTime: new Date().toISOString() // Assuming current date-time
      });

      // Fetch user details again to update the daily logs
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Construct the URL with query parameters
      const url = `http://127.0.0.1:4000/getDeviceInfo?${queryParams}`;

      const response = await axios.get(url, config);
      console.log(response.data)
      setFoodDetails(response.data);
      setShowFoodDetails(true);


      // Fetch user details again to update the daily logs
      const userDetailsResponse = await axios.get("http://127.0.0.1:4000/getUserDetails", config);
      updateDetails(userDetailsResponse.data);

    } catch (error) {
      console.error('Error fetching device information:', error);
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="about-section-text-container">
        <div className='display-box-container'>
          <div className="display-box">
            <h1 className="display-heading">User Details</h1>
            <div className="display-details">
              <p>Name: {userDetails.name}</p>
              <p>Age: {userDetails.age}</p>
              <p>Body Mass Index(BMI): {bmi}</p>
              <p><strong>Calorie Goal Per Day:</strong> {userDetails.calorieGoalPerDay}</p>
            </div>
          </div>
          <div className="display-box">
            <h1 className="display-heading">Daily Logs</h1>
            <div className="display-details">
              {userDetails.dailyLogs && userDetails.dailyLogs.map((log, index) => (
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
            <div className='display-box-container' >
              {foodDetails.instances && foodDetails.instances.map((instance, index) => (
                <div key={index} className="display-box">
                  <div className='display-details'>
                    <p><strong>Food Name:</strong> {instance.foodName}</p>
                    <p><strong>Calories:</strong> {instance.calories}</p>
                    <p><strong>Portion Size: </strong> {instance.serving}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Display;
