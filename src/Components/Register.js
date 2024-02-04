// Registration.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        calorie_intake_goal: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            
            // Make a POST request to the server with registration data
            const response = await axios.post("http://127.0.0.1:4000/register", formData);
            
            // Log the response from the server
            console.log('Server Response:', response.data);
            
            // Reset the form after successful submission
            setFormData({
                name: '',
                age: '',
                calorie_intake_goal: ''
            });

            // to redirect to the display page.
            navigate('/display');
        } catch (error) {
            console.error('Error submitting registration data:', error);
        }    
    };

    return (
        <div>
            <h2>Fill out the info</h2>
            <form onSubmit={handleSubmit}>
                <div className='primary-text'>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="age">Age:</label>
                    <input
                        type='number'
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        min={1}
                        max={99}
                    />
                </div>
                <div>
                    <label htmlFor="calorie_intake_goal">Calorie Intake Goal:</label>
                    <input
                        type="number"
                        id="calorie_intake_goal"
                        name="calorie_intake_goal"
                        value={formData.calorie_intake_goal}
                        onChange={handleChange}
                        required
                    />
                </div>
                </div>

                <button type="submit" className='secondary-button'>Register</button>
            </form>
        </div>

    );
};

export default Registration;
