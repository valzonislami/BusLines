import React, { useState } from 'react';
import axios from 'axios';

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLoginSuccess = (token) => {
        // Store the token in local storage
        localStorage.setItem('token', token);
        // Redirect the user to the main page
        window.location.href = '/';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7264/user/login', {
                email,
                password,
            });
            console.log(response.data);
            // Call handleLoginSuccess and pass the token
            handleLoginSuccess(response.data.token);
        } catch (error) {
            console.error(error);
            setError("Email or Password is incorrect, please try again.");
        }
    };

    return (
        <div>
            {error && <div>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default LogIn;
