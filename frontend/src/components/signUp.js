import React, { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [business, setBusiness] = useState('');

    const generateOwnerId = () => {
        return Math.floor(10000 + Math.random() * 90000).toString(); // Generate a 5-digit random number
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const ownerId = generateOwnerId(); // Generate the random owner ID

        try {
            const response = await axios.post('http://localhost:3000/signup', {
                email,
                password,
                business,
                owner_id: ownerId,
            });
            alert('Signup successful!');
        } catch (error) {
            console.error('Error signing up:', error);
            alert('Error signing up');
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Business:</label>
                    <input type="text" value={business} onChange={(e) => setBusiness(e.target.value)} required />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
