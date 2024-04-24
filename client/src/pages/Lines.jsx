// Lines.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import NavBar from "../components/NavBar"

const Lines = () => {
    const location = useLocation();
    const { startCity: initialStartCity, destinationCity: initialDestinationCity, passengerCount: initialPassengerCount } = location.state;
    const [startCity, setStartCity] = useState(initialStartCity);
    const [destinationCity, setDestinationCity] = useState(initialDestinationCity);
    const [passengerCount, setPassengerCount] = useState(initialPassengerCount);
    const [cities, setCities] = useState([]);
    const [busSchedules, setBusSchedules] = useState([]);

    useEffect(() => {
        // Fetch cities API
        axios.get("https://localhost:7264/City")
            .then(response => {
                setCities(response.data);
            })
            .catch(error => {
                console.error("Error fetching cities:", error);
            });
    }, []);

    useEffect(() => {
        axios.get(`https://localhost:7264/api/BusSchedule?startCityName=${startCity}&destinationCityName=${destinationCity}`)
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
        axios.get(`https://localhost:7264/api/BusSchedule?startCityName=${startCity}&destinationCityName=${destinationCity}`)
            .then((response) => {
                setBusSchedules(response.data);
            })
            .catch((error) => {
                console.error("Error fetching bus schedules:", error);
            });
    };

    return (
        <div>
            <NavBar />
            <h1>Search Bus Lines</h1>
            <form onSubmit={handleSubmit}>
                <div className='flex'>
                    <div className="flex">
                        <input
                            className="w-10"
                            type="number"
                            name="passengerCount"
                            id="passengerCount"
                            value={passengerCount}
                            onChange={handleInputChanges}
                        />
                        <p>Pasagjer</p>
                    </div>
                    <select
                        name="StartCityId"
                        id="StartCityId"
                        onChange={handleInputChanges}
                        value={startCity}
                    >
                        <option value="" disabled>Select Start City</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.name}>{city.name}</option>
                        ))}
                    </select>
                    <select
                        name="DestinationCityId"
                        id="DestinationCityId"
                        onChange={handleInputChanges}
                        value={destinationCity}
                    >
                        <option value="" disabled>Select Destination City</option>
                        {cities.filter(city => city.name !== startCity).map(city => (
                            <option key={city.id} value={city.name}>{city.name}</option>
                        ))}
                    </select>
                    <input type="date" />
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
