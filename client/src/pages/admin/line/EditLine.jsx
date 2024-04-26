import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavBar from "../../../components/NavBar";

const EditLine = () => {
    const { id } = useParams();
    const [busLine, setBusLine] = useState(null);

    useEffect(() => {
        fetchBusLine();
    }, []);

    const fetchBusLine = async () => {
        try {
            const response = await axios.get(`https://localhost:7264/BusLine/${id}`);
            const { startCity, destinationCity } = response.data;
            setBusLine({
                startCityName: startCity.name,
                destinationCityName: destinationCity.name
            });
        } catch (error) {
            console.error('Error fetching bus line:', error);
        }
    };

    const updateBusLine = async () => {
        try {
            await axios.put(`https://localhost:7264/BusLine/${id}`, busLine, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error updating bus line:', error);
        }
    };

    const handleChange = (e) => {
        setBusLine({ ...busLine, [e.target.name]: e.target.value });
    };

    if (!busLine) {
        return null; // or loading indicator
    }

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-3/5">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={updateBusLine} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Edit Bus Line</p>
                        <div className="mb-4">
                            <label htmlFor="startCityName" className="block text-gray-700 text-sm font-bold mb-2">Start City Name:</label>
                            <input
                                type="text"
                                id="startCityName"
                                name="startCityName"
                                value={busLine.startCityName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter start city name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="destinationCityName" className="block text-gray-700 text-sm font-bold mb-2">Destination City Name:</label>
                            <input
                                type="text"
                                id="destinationCityName"
                                name="destinationCityName"
                                value={busLine.destinationCityName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter destination city name"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-orange-400 hover:bg-orange-500"
                        >
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditLine;