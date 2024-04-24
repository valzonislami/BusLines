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
        <div className="min-h-screen flex justify-center items-center bg-orange-50">
            <div className="max-w-md w-full">
                <div className="bg-white py-8 px-6 rounded-lg shadow-lg bg-opacity-90">
                    <h1 className="text-3xl font-semibold text-center text-orange-400 mb-8">Welcome back!</h1>
                    {error && <div className="mb-4 text-orange-400">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-6">
                            <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button className="w-full bg-orange-400 hover:bg-orange-500 py-3 rounded-md text-white font-semibold transition duration-300 ease-in-out" type="submit">Log In</button>
                    </form>
                    <div className="mt-6 text-center text-gray-800">
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogIn;
