import React, { useState } from 'react';
import axios from 'axios';
import NavBar from "../../../components/NavBar"

const BusScheduleCreate = () => {
    const [startCityName, setStartCityName] = useState('');
    const [destinationCityName, setDestinationCityName] = useState('');
    const [operatorName, setOperatorName] = useState('');
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');
    const [price, setPrice] = useState('');
    const [stationNames, setStationNames] = useState(['']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleStartCityChange = (event) => {
        setStartCityName(event.target.value);
        setError('');
        setSuccess('');
    };

    const handleDestinationCityChange = (event) => {
        setDestinationCityName(event.target.value);
        setError('');
        setSuccess('');
    };

    const handleOperatorChange = (event) => {
        setOperatorName(event.target.value);
        setError('');
        setSuccess('');
    };

    const handleDepartureChange = (event) => {
        setDeparture(event.target.value);
        setError('');
        setSuccess('');
    };

    const handleArrivalChange = (event) => {
        setArrival(event.target.value);
        setError('');
        setSuccess('');
    };

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
        setError('');
        setSuccess('');
    };

    const handleStationNameChange = (index, event) => {
        const updatedStations = [...stationNames];
        updatedStations[index] = event.target.value;
        setStationNames(updatedStations);
        setError('');
        setSuccess('');
    };

    const addStation = () => {
        setStationNames([...stationNames, '']);
    };

    const removeStation = (index) => {
        const updatedStations = [...stationNames];
        updatedStations.splice(index, 1);
        setStationNames(updatedStations);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!startCityName.trim() || !destinationCityName.trim() || !operatorName.trim() || !departure.trim() || !arrival.trim() || !price.trim() || stationNames.some(station => !station.trim())) {
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
            setStartCityName('');
            setDestinationCityName('');
            setOperatorName('');
            setDeparture('');
            setArrival('');
            setPrice('');
            setStationNames(['']);
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
                            <input
                                type="text"
                                id="startCityName"
                                value={startCityName}
                                onChange={handleStartCityChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter start city"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="destinationCityName" className="block text-gray-700 text-sm font-bold mb-2">Destination City:</label>
                            <input
                                type="text"
                                id="destinationCityName"
                                value={destinationCityName}
                                onChange={handleDestinationCityChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter destination city"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="operatorName" className="block text-gray-700 text-sm font-bold mb-2">Operator Name:</label>
                            <input
                                type="text"
                                id="operatorName"
                                value={operatorName}
                                onChange={handleOperatorChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter operator name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="departure" className="block text-gray-700 text-sm font-bold mb-2">Departure:</label>
                            <input
                                type="datetime-local"
                                id="departure"
                                value={departure}
                                onChange={handleDepartureChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="arrival" className="block text-gray-700 text-sm font-bold mb-2">Arrival:</label>
                            <input
                                type="datetime-local"
                                id="arrival"
                                value={arrival}
                                onChange={handleArrivalChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={handlePriceChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter price"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Stations:</label>
                            {stationNames.map((station, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={station}
                                        onChange={(event) => handleStationNameChange(index, event)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder={`Enter station ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeStation(index)}
                                        className="ml-2 bg-red-500 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-red-500 hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addStation}
                                className="bg-blue-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-400 hover:bg-blue-500"
                            >
                                Add Station
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-orange-400 hover:bg-orange-500"
                        >
                            Add Bus Schedule
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default BusScheduleCreate;
