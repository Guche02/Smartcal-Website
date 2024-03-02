import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./Navbar";

const Display = () => {
  const [errors, setErrors] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [bmi, setBMI] = useState(null);
  const [showFoodDetails, setShowFoodDetails] = useState(false);
  const [foodDetails, setFoodDetails] = useState({
    total_calories_taken: 0,
    instances: [],
  });
  const [visualizedImage, setVisualizedImage] = useState(null); // State to store the visualized image data
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
      let errors = {};
      // Validation for age
      let error = '';
      if (updatedDetails.age) {
        error = updatedDetails.age < 18 || updatedDetails.age > 100 ? 'Range 10-100' : '';
        errors = { ...errors, age: error };
      }
      // Validation for weight
      if (updatedDetails.weight) {
        error = updatedDetails.weight < 25 || updatedDetails.weight > 300 ? 'Range 15-300' : '';
        errors = { ...errors, weight: error };
      }
      // Validation for height
      if (updatedDetails.height) {
        error = updatedDetails.height <= 100 || updatedDetails.height > 250 ? 'Range 100-250' : '';
        errors = { ...errors, height: error };
      }
      // Validation for calorie goal per day
      if (updatedDetails.calorieGoalPerDay) {
        error = updatedDetails.calorieGoalPerDay <= 250 || updatedDetails.calorieGoalPerDay > 4000 ? 'Calorie goal must be between 250 and 4000 kcal' : '';
        errors = { ...errors, calorieGoalPerDay: error };
      }
      // If there are errors, stop the update process
      if (Object.values(errors).some(error => error !== '')) {
        setErrors(errors);
        return;
      }

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
      setVisualizedImage(response.data.visualized_image);
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

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (isFormValid()) {
      updateDetails();
    }
  };

  const isFormValid = () => {
    return Object.values(updatedDetails).every(value => value.trim() !== ''); // Check if all field values are not empty
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
                <form onSubmit={handleFormSubmit}>
                  <div className="input-container">
                    <input type="text" name="name" placeholder="Name" value={updatedDetails.name} onChange={handleInputChange} required  autoComplete='off'/>
                  </div>
                  <div className="input-container">
                    <input type="number" name="age" placeholder="Age" value={updatedDetails.age} onChange={handleInputChange} required autoComplete='off' />
                    {errors.age && <p className="error-message">{errors.age}</p>}
                  </div>
                  <div className="input-container">
                    <input type="number" name="weight" placeholder="Weight" value={updatedDetails.weight} onChange={handleInputChange} required autoComplete='off' />
                    {errors.weight && <p className="error-message">{errors.weight}</p>}
                  </div>
                  <div className="input-container">
                    <input type="number" name="height" placeholder="Height" value={updatedDetails.height} onChange={handleInputChange} required autoComplete='off'/>
                    {errors.height && <p className="error-message">{errors.height}</p>}
                  </div>
                  <div className="input-container">
                    <input type="number" name="calorieGoalPerDay" placeholder="Calorie Goal Per Day" value={updatedDetails.calorieGoalPerDay} onChange={handleInputChange} required autoComplete='off'/>
                    {errors.calorieGoalPerDay && <p className="error-message">{errors.calorieGoalPerDay}</p>}
                  </div>
                  <button type="submit" disabled={!isFormValid()}>Save</button>
                </form>

              ) : (
                <>
                  <p>Name: {userDetails.name}</p>
                  <p>Age: {userDetails.age}</p>
                  <p>Body Mass Index(BMI): {bmi}</p>
                  <p><strong>Calorie Goal Per Day:</strong> {userDetails.calorieGoalPerDay}</p>
                  <button onClick={handleUpdateDetails}>Update Info</button>
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
            <img src={`data:image/png;base64,${visualizedImage}`} alt="Visualized Image" style={{ maxWidth: "400px", maxHeight: "500px" }} />
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
}

export default Display;