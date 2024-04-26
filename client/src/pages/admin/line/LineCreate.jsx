import React, { useState } from 'react';
import axios from 'axios';
import NavBar from "../../../components/NavBar";

const LineCreate = () => {
    const [startCityName, setStartCityName] = useState('');
    const [destinationCityName, setDestinationCityName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleStartCityNameChange = (event) => {
        setStartCityName(event.target.value);
        setError('');
        setSuccess('');
    };

    const handleDestinationCityNameChange = (event) => {
        setDestinationCityName(event.target.value);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!startCityName.trim() || !destinationCityName.trim()) {
            setError('Please enter both start and destination city names.');
            return;
        }
        try {
            const response = await axios.post('https://localhost:7264/BusLine', {
                startCityName: startCityName,
                destinationCityName: destinationCityName
            });
            setSuccess(`Bus line from "${response.data.startCity.name}" to "${response.data.destinationCity.name}" added successfully.`);
            setStartCityName('');
            setDestinationCityName('');
            setError('');
        } catch (error) {
            setError('Error adding bus line. Please try again.');
            console.error('Error adding bus line:', error);
        }
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-3/5">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={handleSubmit} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Add Bus Line</p>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                        <div className="mb-4">
                            <label htmlFor="startCityName" className="block text-gray-700 text-sm font-bold mb-2">Start City Name:</label>
                            <input
                                type="text"
                                id="startCityName"
                                value={startCityName}
                                onChange={handleStartCityNameChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter start city name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="destinationCityName" className="block text-gray-700 text-sm font-bold mb-2">Destination City Name:</label>
                            <input
                                type="text"
                                id="destinationCityName"
                                value={destinationCityName}
                                onChange={handleDestinationCityNameChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter destination city name"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-orange-400 hover:bg-orange-500"
                        >
                            Add Bus Line
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LineCreate;