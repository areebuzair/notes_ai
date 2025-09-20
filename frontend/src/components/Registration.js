import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../Style/Registration.css';
import logo from '../Photo/logo.jpg';

function Registration() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (response.status === 200) {
                navigate('/login');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="registration-background">
            <div className="registration-box">
                <img src={logo} alt="App Logo" className="registration-logo" />
                <h2 className="registration-title">Create Account</h2>
                <form onSubmit={handleSubmit} className="registration-form">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="registration-input"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="registration-input"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="registration-input"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="registration-input"
                        required
                    />
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="register-button">Register</button>
                    <div className="login-link">
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Registration;