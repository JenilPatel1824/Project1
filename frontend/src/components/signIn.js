import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import axios from 'axios';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', {
                email,
                password
            });
            alert('Login successful!');
            console.log(response);
            // Save the token for authenticated requests
            localStorage.setItem('token', response.data.token);
            navigate('/home');
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in');
        }
    };

    const handleSignUpClick = () => {
        navigate('/signUp'); // Redirect to SignUp page using useNavigate
    };

    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Sign In</button>
            </form>
            <button onClick={handleSignUpClick}>Sign Up</button> {/* "Sign Up" button */}
        </div>
    );
};

export default SignIn;
