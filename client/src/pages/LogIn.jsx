import { useState } from 'react';
import axios from 'axios';

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


    const handleLoginSuccess = (token) => {
        // Store the token in local storage
        localStorage.setItem('token', token);
        // Redirect the user to the main page
        window.location.href = '/';
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
                handleLoginSuccess(response.data.token);
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
        <div className="min-h-screen flex justify-center items-center bg-orange-50">
            <div className="max-w-md w-full">
                <div className={`bg-white py-8 px-6 rounded-lg shadow-lg ${mode === 'login' ? 'bg-opacity-90' : 'bg-opacity-80'}`}>
                    <h1 className="text-3xl font-semibold text-center text-orange-400 mb-8">{mode === 'login' ? 'Welcome back!' : 'Sign up'}</h1>
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
                                <div>
                                    <input type="text" id="firstname" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                </div>
                                <div>
                                    <input  type="text" id="lastname" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                </div>
                                <div>
                                    <input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div>
                                    <input type="password" id="createpassword" placeholder="Create Password" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} required />
                                </div>
                                <div>
                                    <input type="password" id="repeatpassword" placeholder="Repeat Password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
                                </div>
                            </>
                        )}
                        <button className="w-full bg-orange-400 hover:bg-orange-500 py-3 rounded-md text-white font-semibold transition duration-300 ease-in-out" type="submit">{mode === 'login' ? 'Log In' : 'Sign Up'}</button>
                    </form>
                    <div className="mt-6 text-center text-gray-800">
                        <span>{mode === 'login' ? "Don't" : 'Already'} have an account?</span>
                        <button className="ml-2 text-orange-400 hover:underline focus:outline-none" onClick={toggleMode}>{mode === 'login' ? 'Sign up' : 'Log in'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogIn;
