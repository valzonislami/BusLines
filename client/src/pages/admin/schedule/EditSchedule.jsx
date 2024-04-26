import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavBar from "../../../components/NavBar";

const EditBusSchedule = () => {
    const { id } = useParams();
    const [busSchedule, setBusSchedule] = useState({
        id: 0,
        operatorName: '',
        departure: '',
        arrival: '',
        price: 0,
    });
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBusSchedule();
        fetchOperators();
    }, []);

    const fetchBusSchedule = async () => {
        try {
            const response = await axios.get(`https://localhost:7264/BusSchedule/${id}`);
            setBusSchedule(response.data);
        } catch (error) {
            console.error('Error fetching bus schedule:', error);
        }
    };

    const fetchOperators = async () => {
        try {
            const response = await axios.get('https://localhost:7264/Operator');
            setOperators(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching operators:', error);
        }
    };

    const updateBusSchedule = async () => {
        try {
            const response = await axios.put(`https://localhost:7264/BusSchedule/${id}`, busSchedule);
        } catch (error) {
            console.error('Error updating bus schedule:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Name: ${name}, Value: ${value}`);
        setBusSchedule(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-3/5">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={updateBusSchedule} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Edit Bus Schedule</p>
                        <div className="mb-4">
                            <label htmlFor="operatorName" className="block text-gray-700 text-sm font-bold mb-2">Operator Name:</label>
                            <select
                                id="operatorName"
                                name="operatorName"
                                value={busSchedule.operatorName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                {loading ? (
                                    <option>Loading...</option>
                                ) : (
                                    operators.map(operator => (
                                        <option key={operator.id} value={operator.name}>{operator.name}</option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="departure" className="block text-gray-700 text-sm font-bold mb-2">Departure Time:</label>
                            <input
                                type="datetime-local"
                                id="departure"
                                name="departure"
                                value={busSchedule.departure}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="arrival" className="block text-gray-700 text-sm font-bold mb-2">Arrival Time:</label>
                            <input
                                type="datetime-local"
                                id="arrival"
                                name="arrival"
                                value={busSchedule.arrival}
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
                                value={busSchedule.price}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

export default EditBusSchedule;
