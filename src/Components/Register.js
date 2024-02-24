import React, { useState } from 'react';
import axios from 'axios';
import Navbar from "./Navbar";
import { useNavigate, Link } from 'react-router-dom';

const Registration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        weight: '',
        height: '',
        calorieGoalPerDay: ''
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
                email: '',
                password: '',
                age: '',
                weight: '',
                height: '',
                calorieGoalPerDay: ''
            });

            // Redirect to the display page
            navigate('/login');
        } catch (error) {
            console.error('Error submitting registration data:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <h2>Fill out the info</h2>
            <form onSubmit={handleSubmit}>
                <div className='primary-text'>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="string"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="age">Age:</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="weight">Weight (kg):</label>
                        <input
                            type="number"
                            id="weight"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="height">Height (cm):</label>
                        <input
                            type="number"
                            id="height"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="calorieGoalPerDay">Calorie Goal Per Day:</label>
                        <input
                            type="number"
                            id="calorieGoalPerDay"
                            name="calorieGoalPerDay"
                            value={formData.calorieGoalPerDay}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <button type="submit" className='secondary-button' onClick={handleSubmit}>Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Registration;
