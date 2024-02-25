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
  const [imageData, setImageData] = useState(null);
  const [editingDetails, setEditingDetails] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    calorieGoalPerDay: '',
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
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
  const updateDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.post("http://127.0.0.1:4000/updatedetails", updatedDetails, config);
      setEditingDetails(false);
      const response = await axios.get("http://127.0.0.1:4000/getUserDetails", config);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleUseDeviceClick = async () => {
    try {
      const queryParams = new URLSearchParams({
        dateTime: new Date().toISOString()
      });
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const url = `http://127.0.0.1:4000/getDeviceInfo?${queryParams}`;
      const response = await axios.get(url, config);
      console.log(response.data)
      setFoodDetails(response.data);
      setShowFoodDetails(true);
      const userDetailsResponse = await axios.get("http://127.0.0.1:4000/getUserDetails", config);
      setUserDetails(userDetailsResponse.data);
    } catch (error) {
      console.error('Error fetching device information:', error);
    }
  };

  const GetImage = async () => {
    try {
      const imageResponse = await axios.get("http://127.0.0.1:4000/getImage", { responseType: 'blob' });
      const reader = new FileReader();
      reader.onload = () => {
        setImageData(reader.result);
      };
      reader.readAsDataURL(imageResponse.data);
    } catch (error) {
      alert("Click a new image to try again.")
      window.location.reload()
      console.error('Error fetching image:', error);
    }
  };

  const handleImageConfirmation = () => {
    console.log("User accepted the image.")
    handleUseDeviceClick();
    setImageData(null); // Clear the image data
  };

  const handleImageRejection = async () => {
    console.log("User denied the image.");
    setImageData(null); // Clear the image data
    alert("Click a new image to try again.");
    await axios.delete("http://127.0.0.1:4000/deleteImage");
  };

  const handleUpdateDetails = () => {
    setEditingDetails(true);
  };

  const handleInputChange = (e) => {
    setUpdatedDetails({ ...updatedDetails, [e.target.name]: e.target.value });
  };
  return (
    <div className="home-container">
      <Navbar />
      <div className="about-section-text-container">
        <div className='display-box-container'>
          <div className="display-box">
            <h1 className="display-heading">User Details</h1>
            <div className="display-details">
              {editingDetails ? (
                <>
                <div className="input-container">
                  <input type="text" name="name" placeholder="Name" value={updatedDetails.name} onChange={handleInputChange} />
                </div>
                <div className="input-container">
                  <input type="text" name="age" placeholder="Age" value={updatedDetails.age} onChange={handleInputChange} />
                </div>
                <div className="input-container">
                  <input type="text" name="weight" placeholder="Weight" value={updatedDetails.weight} onChange={handleInputChange} />
                </div>
                <div className="input-container">
                  <input type="text" name="height" placeholder="Height" value={updatedDetails.height} onChange={handleInputChange} />
                </div>
                <div className="input-container">
                  <input type="text" name="calorieGoalPerDay" placeholder="Calorie Goal Per Day" value={updatedDetails.calorieGoalPerDay} onChange={handleInputChange} />
                </div>
                <button onClick={updateDetails}>Save</button>
              </>
              ) : (
                <>
                  <p>Name: {userDetails.name}</p>
                  <p>Age: {userDetails.age}</p>
                  <p>Body Mass Index(BMI): {bmi}</p>
                  <p><strong>Calorie Goal Per Day:</strong> {userDetails.calorieGoalPerDay}</p>
                  <button classname='secondary-button' onClick={handleUpdateDetails}>Update Info</button>
                </>
              )}
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

        <button className="secondary-button" onClick={GetImage}>
          Use Device
        </button>

        {imageData && (
          <div className='about-section-text-container'>
            <h1>Do you want to use this image?</h1>
            <div className='display-box-container'>
              <div className='display-box'>
                <img src={imageData} alt="Server Image" style={{ maxWidth: "500px", maxHeight: "500px" }} />
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                  <button className='secondary-button' onClick={handleImageConfirmation}>Confirm</button>
                  <button className='secondary-button' onClick={handleImageRejection}>Reject</button>
                </div>
              </div>
            </div>
          </div>
        )}

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
