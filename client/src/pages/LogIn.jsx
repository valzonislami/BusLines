import { useState } from 'react';
import axios from 'axios';
import BusLogo from "../assets/BusLogo.svg";
import { Link } from 'react-router-dom';


const LogIn = () => {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [createPassword, setCreatePassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');

    const toggleMode = () => {
        setMode(prevMode => (prevMode === 'login' ? 'signup' : 'login'));
        setError(''); // Reset error message when toggling mode
    };

    const checkExistingEmail = async (email) => {
        try {
            const response = await axios.get(`https://localhost:7264/User?email=${email}`);
            if (response.data && response.data.length > 0) {
                return true; // Email exists
            } else {
                return false; // Email doesn't exist
            }
        } catch (error) {
            console.error(error);
            return false; // Assume email doesn't exist on error
        }
    };

    const handleLoginSuccess = (token, userId, userRole) => {
        // Store the token in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userRole', userRole);

        // Redirect the user based on their role
        if (userRole === 0) {
            // Redirect user to main page
            window.location.href = '/';
        } else if (userRole === 1) {
            // Redirect user to admin page
            window.location.href = '/admin';
        } else {
            // Handle other roles if needed
            // For now, redirect to main page
            window.location.href = '/';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === 'login') {
            try {
                const response = await axios.post('https://localhost:7264/user/login', {
                    email,
                    password,
                });
                console.log(response.data);
                // Call handleLoginSuccess and pass the token
                handleLoginSuccess(response.data.token, response.data.userId, response.data.userRole);
            } catch (error) {
                console.error(error);
                setError("Email or Password is incorrect, please try again.");
            }
        } else {
            if (createPassword !== repeatPassword) {
                setError("Passwords do not match");
                return; // Prevent further execution if passwords don't match
            }
            const emailExists = await checkExistingEmail(email);
            if (emailExists) {
                setError("Email already exists, you can try login with this email.");
                return;
            }
            try {
                const response = await axios.post('https://localhost:7264/user', {
                    firstName,
                    lastName,
                    email,
                    password: createPassword,
                });
                console.log(response.data);
            } catch (error) {
                console.error(error);
                setError("An error occurred while signing up. Please try again later.");
            }
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-white">
            <div className="max-w-md w-full">
                <div className={`bg-white py-8 px-6 rounded-lg shadow-2xl ${mode === 'login' ? 'bg-opacity-90' : 'bg-opacity-80'}`}>
                    <Link to="../">
                        <div className="flex justify-center mb-8">
                            <img src={BusLogo} alt="Buslines Logo " />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-normal text-center text-black mb-8">{mode === 'login' ? 'Miresevini!' : 'Regjistrohu'}</h1>
                    {error && <div className="mb-4 text-orange-400">{error}</div>} {/* Apply custom style to error message */}
                    <form onSubmit={handleSubmit}>
                        {mode !== 'signup' && (
                            <>
                                <div className="mb-6">
                                    <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="mb-6">
                                    <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                            </>
                        )}
                        {mode === 'signup' && (
                            <>
                                <div className="mb-6">
                                    <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="text" id="firstname" placeholder="Emri" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                </div>
                                <div className="mb-6">
                                    <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="text" id="lastname" placeholder="Mbiemri" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                </div>
                                <div className="mb-6">
                                    <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="mb-6">
                                    <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="password" id="createpassword" placeholder="Shkruaj passwordin" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} required />
                                </div>
                                <div className="mb-6">
                                    <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="password" id="repeatpassword" placeholder="Perserit passwordin" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
                                </div>
                            </>
                        )}
                        <button className="w-full bg-orange-400 hover:bg-orange-500 py-3 rounded-md text-white font-semibold transition duration-300 ease-in-out" type="submit">{mode === 'login' ? 'Kyqu' : 'Regjistrohu'}</button>
                    </form>
                    <div className="mt-6 text-center text-gray-800">
                        <span>{mode === 'login' ? "Nuk keni" : 'Keni'} llogari?</span>
                        <button className="ml-2 text-orange-400 hover:underline focus:outline-none" onClick={toggleMode}>{mode === 'login' ? 'Regjistrohu' : 'Kyqu'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogIn;