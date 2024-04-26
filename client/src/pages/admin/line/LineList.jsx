import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from "../../../components/NavBar";

const LineList = () => {
    const [busLines, setBusLines] = useState([]);

    useEffect(() => {
        fetchBusLines();
    }, []);

    const fetchBusLines = async () => {
        try {
            const response = await axios.get('https://localhost:7264/BusLine');
            setBusLines(response.data);
        } catch (error) {
            console.error('Error fetching bus lines:', error);
        }
    };

    const deleteBusLine = async (id) => {
        try {
            await axios.delete(`https://localhost:7264/BusLine/${id}`);
            fetchBusLines();
        } catch (error) {
            console.error('Error deleting bus line:', error);
        }
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-3/5">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <div className="flex justify-between items-center border-b border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-700">Bus Line List</h2>
                        <Link to="/admin/lines/addLine">
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
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {busLines.map((busLine, index) => (
                                    <tr key={busLine.id}>
                                        <td className="px-6 py-4">{busLine.id}</td>
                                        <td className="px-6 py-4">{busLine.startCity.name}</td>
                                        <td className="px-6 py-4">{busLine.destinationCity.name}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => deleteBusLine(busLine.id)} className="text-red-600 hover:text-red-900">
                                                Delete
                                            </button>
                                            <Link to={`/admin/lines/${busLine.id}/edit`} className="text-blue-600 hover:text-blue-900 ml-10">
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

export default LineList;