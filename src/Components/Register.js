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

    const [emailError, setEmailError] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'email') {
            setEmailError(
                !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)
                    ? 'Enter a valid email address'
                    : ''
            )
        }
        let error = '';
        if (name === 'age') {
            error = value < 10 || value > 100 ? 'Age must be between 10 and 100' : '';
        } else if (name === 'weight') {
            error = value < 15 || value > 300 ? 'Weight must be between 15 and 300 kg' : '';
        } else if (name === 'height') {
            error = value <= 100 || value > 250 ? 'Height must be between 100 and 250 cm' : '';
        } else if (name === 'calorieGoalPerDay') {
            error = value <= 250 || value > 4000 ? 'Calorie goal must be between 250 and 4000 kcal' : '';
        }
    
        setErrors({ ...errors, [name]: error });

    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if there are any errors
        const inputErrors = Object.values(errors).filter(error => error !== '');
        if (inputErrors.length > 0 || emailError !== '') {
            console.error('Invalid input');
            return;
        }

        // Check if all fields are filled
        const formValues = Object.values(formData);
        if (formValues.some(value => value.trim() === '')) {
            console.error('All fields are required');
            return;
        }

        try {
            // Make a POST request to the server with registration data
            const response = await axios.post("http://127.0.0.1:4000/user/register", formData);
            
            console.log(response.data)
            
            if(!response.data.success) {
                alert(`Error: ${response.data.error}`)
            }
           else {
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
        }
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
                            autoComplete='off'
                            autoCapitalize='on'
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
                            autoComplete='off'
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {emailError && <p className="error-message">{emailError}</p>}
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            autoComplete='off'
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
                            autoComplete='off'
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            required
                        />
                        {errors.age && <p className="error-message">{errors.age}</p>}
                    </div>
                    <div>
                        <label htmlFor="weight">Weight (kg):</label>
                        <input
                            autoComplete='off'
                            type="number"
                            id="weight"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            required
                        />
                        {errors.weight && <p className="error-message">{errors.weight}</p>}
                    </div>
                    <div>
                        <label htmlFor="height">Height (cm):</label>
                        <input
                            autoComplete='off'
                            type="number"
                            id="height"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            required
                        />
                        {errors.height && <p className="error-message">{errors.height}</p>}
                    </div>
                    <div>
                        <label htmlFor="calorieGoalPerDay">Calorie Goal Per Day:</label>
                        <input
                            autoComplete='off'
                            type="number"
                            id="calorieGoalPerDay"
                            name="calorieGoalPerDay"
                            value={formData.calorieGoalPerDay}
                            onChange={handleChange}
                            required
                        />
                        {errors.calorieGoalPerDay && <p className="error-message">{errors.calorieGoalPerDay}</p>}
                    </div>
                </div>
                <button type="submit" className='secondary-button'>Register</button>
            </form>

            <h3>Already have an account? <Link to="/login">Login</Link></h3>

        </div>
    );
};

export default Registration;
