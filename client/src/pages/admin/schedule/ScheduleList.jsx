import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from "../../../components/NavBar"

const BusScheduleList = () => {
    const [busSchedules, setBusSchedules] = useState([]);

    useEffect(() => {
        fetchBusSchedules();
    }, []);

    const fetchBusSchedules = async () => {
        try {
            const response = await axios.get('https://localhost:7264/BusSchedule');
            const sortedBusSchedules = response.data.sort((a, b) => a.id - b.id); // Sort by ID
            const formattedBusSchedules = sortedBusSchedules.map(schedule => ({
                ...schedule,
                departure: new Date(schedule.departure).toLocaleString(),
                arrival: new Date(schedule.arrival).toLocaleString()
            }));
            setBusSchedules(formattedBusSchedules);
        } catch (error) {
            console.error('Error fetching bus schedules:', error);
        }
    };

    const deleteBusSchedule = async (id) => {
        try {
            await axios.delete(`https://localhost:7264/BusSchedule/${id}`);
            fetchBusSchedules();
        } catch (error) {
            console.error('Error deleting bus schedule:', error);
        }
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-11/12">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <div className="flex justify-between items-center border-b border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-700">Bus Schedule List</h2>
                        <Link to="/admin/schedules/addSchedule">
                            <button className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-orange-400 hover:bg-orange-500">
                                Add new
                            </button>
                        </Link>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full whitespace-no-wrap">
                            <thead>
                                <tr className="text-left font-bold">
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">ID</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Start City</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Destination City</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Departure</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Arrival</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Stops</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {busSchedules.map((schedule, index) => (
                                    <tr key={schedule.id}>
                                        <td className="px-6 py-4">{schedule.id}</td>
                                        <td className="px-6 py-4">{schedule.startCityName}</td>
                                        <td className="px-6 py-4">{schedule.destinationCityName}</td>
                                        <td className="px-6 py-4">{schedule.departure}</td>
                                        <td className="px-6 py-4">{schedule.arrival}</td>
                                        <td className="px-6 py-4">{schedule.stationNames.join(', ')}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => deleteBusSchedule(schedule.id)} className="text-red-600 hover:text-red-900">
                                                Delete
                                            </button>
                                            <Link to={`/admin/schedules/${schedule.id}/edit`} className="text-blue-600 hover:text-blue-900 ml-10">
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BusScheduleList;
