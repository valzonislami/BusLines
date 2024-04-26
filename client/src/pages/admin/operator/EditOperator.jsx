import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavBar from "../../../components/NavBar"

const EditOperator = () => {
    const { id } = useParams();
    const [operator, setOperator] = useState({ name: '' });

    useEffect(() => {
        fetchOperator();
    }, []);

    const fetchOperator = async () => {
        try {
            const response = await axios.get(`https://localhost:7264/Operator/${id}`);
            setOperator(response.data);
        } catch (error) {
            console.error('Error fetching operator:', error);
        }
    };

    const updateOperator = async () => {
        try {
            const response = await axios.put(`https://localhost:7264/Operator/${id}`, operator, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error updating operator:', error);
        }
    };

    const handleChange = (e) => {
        setOperator({ ...operator, [e.target.name]: e.target.value });
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-3/5">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={updateOperator} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Edit Operator</p>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Operator Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={operator.name}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter operator name"
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

export default EditOperator;
