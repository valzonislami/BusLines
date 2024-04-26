import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from "../../../components/NavBar";

const ScheduleCreate = () => {
    const [formData, setFormData] = useState({
        startCityName: '',
        destinationCityName: '',
        operatorName: '',
        departure: '',
        arrival: '',
        price: '',
        stationNames: [],
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cities, setCities] = useState([]);
    const [operators, setOperators] = useState([]);
    const [stops, setStops] = useState([]);
    const [selectedStop, setSelectedStop] = useState('');

    useEffect(() => {
        fetchCities();
        fetchOperators();
        fetchStops();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await axios.get('https://localhost:7264/city');
            const sortedCities = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setCities(sortedCities);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const fetchOperators = async () => {
        try {
            const response = await axios.get('https://localhost:7264/Operator');
            const sortedOperators = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setOperators(sortedOperators);
        } catch (error) {
            console.error('Error fetching operators:', error);
        }
    };

    const fetchStops = async () => {
        try {
            const response = await axios.get('https://localhost:7264/Stop');
            const sortedStops = response.data.sort((a, b) => a.stationName.localeCompare(b.stationName));
            setStops(sortedStops);
        } catch (error) {
            console.error('Error fetching stops:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setError('');
        setSuccess('');
    };

    const handleSelectStopChange = (event) => {
        setSelectedStop(event.target.value);
    };

    const handleAddStop = () => {
        if (selectedStop.trim() !== '' && !formData.stationNames.includes(selectedStop)) {
            setFormData({
                ...formData,
                stationNames: [...formData.stationNames, selectedStop.trim()],
            });
            setSelectedStop('');
        }
    };

    const handleRemoveStop = (index) => {
        setFormData({
            ...formData,
            stationNames: formData.stationNames.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { startCityName, destinationCityName, operatorName, departure, arrival, price, stationNames } = formData;
        if (!startCityName || !destinationCityName || !operatorName || !departure || !arrival || !price || stationNames.some(station => !station.trim())) {
            setError('Please fill in all fields.');
            return;
        }
        try {
            const response = await axios.post('https://localhost:7264/BusSchedule', {
                startCityName,
                destinationCityName,
                operatorName,
                departure,
                arrival,
                price: parseFloat(price),
                stationNames
            });
            setSuccess(`Bus schedule added successfully.`);
            setFormData({
                startCityName: '',
                destinationCityName: '',
                operatorName: '',
                departure: '',
                arrival: '',
                price: '',
                stationNames: [],
            });
            setError('');
        } catch (error) {
            setError('Error adding bus schedule. Please try again.');
            console.error('Error adding bus schedule:', error);
        }
    };
    return (
        <>
            <NavBar />
            <div className="container mx-auto w-3/5">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={handleSubmit} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Add Bus Schedule</p>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                        <div className="mb-4">
                            <label htmlFor="startCityName" className="block text-gray-700 text-sm font-bold mb-2">Start City:</label>
                            <select
                                id="startCityName"
                                name="startCityName"
                                value={formData.startCityName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select start city</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="destinationCityName" className="block text-gray-700 text-sm font-bold mb-2">Destination City:</label>
                            <select
                                id="destinationCityName"
                                name="destinationCityName"
                                value={formData.destinationCityName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select destination city</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="operatorName" className="block text-gray-700 text-sm font-bold mb-2">Operator Name:</label>
                            <select
                                id="operatorName"
                                name="operatorName"
                                value={formData.operatorName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select operator</option>
                                {operators.map(operator => (
                                    <option key={operator.id} value={operator.name}>{operator.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="departure" className="block text-gray-700 text-sm font-bold mb-2">Departure:</label>
                            <input
                                type="datetime-local"
                                id="departure"
                                name="departure"
                                value={formData.departure}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="arrival" className="block text-gray-700 text-sm font-bold mb-2">Arrival:</label>
                            <input
                                type="datetime-local"
                                id="arrival"
                                name="arrival"
                                value={formData.arrival}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter price"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="selectStop" className="block text-gray-700 text-sm font-bold mb-2">Select Stop:</label>
                            <select
                                id="selectStop"
                                value={selectedStop}
                                onChange={handleSelectStopChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select a stop</option>
                                {stops.map(stop => (
                                    <option key={stop.id} value={stop.stationName}>{stop.stationName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <button
                                type="button"
                                onClick={handleAddStop}
                                className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-500 hover:bg-blue-600"
                            >
                                Add Stop
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Stops:</label>
                            <ul>
                                {formData.stationNames.map((stop, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        <span>{stop}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStop(index)}
                                            className="bg-red-500 text-white font-medium py-1 px-2 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-red-500 hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-orange-400 hover:bg-orange-500"
                        >
                            Add Bus Schedule
                        </button>
                        <Link
                            to="/admin/schedules" // Replace this with your desired route
                            className="bg-gray-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-gray-400 hover:bg-gray-500 ml-2"
                        >
                            Back
                        </Link>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ScheduleCreate;