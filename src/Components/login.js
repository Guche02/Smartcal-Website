import React, { useState } from 'react';
import axios from 'axios';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make a POST request to the server with login data
            const response = await axios.post("http://127.0.0.1:4000/login", formData);

            // Log the response from the server
            console.log('Server Response:', response.data);

            // Check if login was successful based on the response
            if (response.data.success) {
                // Store the token in local storage
                localStorage.setItem('token', response.data.token);

                // Redirect to the user details page
                navigate('/display');
            } else {
                // Handle login failure, e.g., display an error message
                console.error('Login failed:', response.data.error);
            }

            // Reset the form after submission
            setFormData({
                email: '',
                password: ''
            });
        } catch (error) {
            console.error('Error submitting login data:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className='primary-text'>
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
                </div>

                <button type="submit" className='secondary-button'>Login</button>
            </form>
        </div>
    );
};

export default Login;
