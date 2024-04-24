// Lines.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Lines = () => {
    const location = useLocation();
    const { startCity: initialStartCity, destinationCity: initialDestinationCity, passengerCount: initialPassengerCount } = location.state;
    const [startCity, setStartCity] = useState(initialStartCity);
    const [destinationCity, setDestinationCity] = useState(initialDestinationCity);
    const [passengerCount, setPassengerCount] = useState(initialPassengerCount);
    const [busSchedules, setBusSchedules] = useState([]);

    useEffect(() => {
        axios.get(`https://localhost:7264/api/BusSchedule?startCity=${startCity}&destinationCity=${destinationCity}`)
            .then((response) => {
                setBusSchedules(response.data);
            })
            .catch((error) => {
                console.error("Error fetching bus schedules:", error);
            });
    }, [startCity, destinationCity]);

    const handleInputChanges = (e) => {
        const { name, value } = e.target;
        if (name === 'startCity') {
            setStartCity(value);
        } else if (name === 'destinationCity') {
            setDestinationCity(value);
        } else if (name === 'passengerCount') {
            setPassengerCount(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get(`https://localhost:7264/api/BusSchedule?startCity=${startCity}&destinationCity=${destinationCity}`)
            .then((response) => {
                setBusSchedules(response.data);
            })
            .catch((error) => {
                console.error("Error fetching bus schedules:", error);
            });
    };

    return (
        <div>
            <h1>Search Bus Lines</h1>
            <form onSubmit={handleSubmit}>
                <div className='flex'>
                    <select name="startCity" value={startCity} onChange={handleInputChanges}>
                        <option value='' defaultValue='0'>Nisja</option>
                        <option value='Prishtina'>Prishtina</option>
                        {/* Add other city options similarly */}
                    </select>
                    <select name="destinationCity" value={destinationCity} onChange={handleInputChanges}>
                        <option value='' defaultValue='0'>Destinacioni</option>
                        <option value='Shkup'>Shkup</option>
                        {/* Add other city options similarly */}
                    </select>
                    <input className='w-10' type="number" name='passengerCount' value={passengerCount} onChange={handleInputChanges} />
                    <p>Pasagjer</p>
                    <button type="submit" className='w-20 h-10 bg-primary'>Search</button>
                </div>
            </form>
            <div>
                <h3>Bus Schedules</h3>
                <ul>
                    {busSchedules.map((schedule) => {
                        const dateTimeString = schedule.departure;
                        const dateTime = new Date(dateTimeString);
                        const departureDate = dateTime.toLocaleDateString();
                        const departureTime = dateTime.toLocaleTimeString();

                        const totalPrice = schedule.price * passengerCount;

                        return (
                            <div key={schedule.id} className='bg-gray-100 p-4 rounded-lg shadow-md mb-4 flex'>
                                <div className='flex flex-col'>
                                    <h1 className='text-lg font-bold'>Departure: {schedule.startCityName}</h1>
                                    <h1 className='text-lg font-bold'>Destination: {schedule.destinationCityName}</h1>
                                </div>
                                <div className='ml-4 flex flex-col'>
                                    <h1 className='text-lg font-bold'>Operator: {schedule.operatorName}</h1>
                                    <h2 className='text-sm'>Departure Date: {departureDate}</h2>
                                    <h2 className='text-sm'>Departure Time: {departureTime}</h2>
                                    <h2 className='text-lg font-bold'>Total Price: {totalPrice}€</h2>
                                </div>
                            </div>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Lines;
