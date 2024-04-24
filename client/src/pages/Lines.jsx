// Lines.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import NavBar from "../components/NavBar"

const Lines = () => {
    const location = useLocation();
    const { startCity: initialStartCity, destinationCity: initialDestinationCity, passengerCount: initialPassengerCount, departureTime: initialDepartureTime } = location.state;
    const [startCity, setStartCity] = useState(initialStartCity);
    const [destinationCity, setDestinationCity] = useState(initialDestinationCity);
    const [passengerCount, setPassengerCount] = useState(initialPassengerCount);
    const [departureTime, setDepartureTime] = useState(initialDepartureTime);
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
        axios.get(`https://localhost:7264/BusSchedule?startCityName=${startCity}&destinationCityName=${destinationCity}&&departureDate=${departureTime}`)
            .then((response) => {
                setBusSchedules(response.data);
            })
            .catch((error) => {
                console.error("Error fetching bus schedules:", error);
            });
    }, [startCity, destinationCity]);

    const handleInputChanges = (e) => {
        const { name, value } = e.target;
        if (name === 'StartCityId') {
            setStartCity(value);
        } else if (name === 'DestinationCityId') {
            setDestinationCity(value);
        } else if (name === 'passengerCount') {
            setPassengerCount(Number(value));
        } else if (name === "departureTime") {
            setDepartureTime(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get(`https://localhost:7264/BusSchedule?startCityName=${startCity}&destinationCityName=${destinationCity}`)
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
            <div className="flex justify-center items-center mt-10">
                <div>
                    <h3 className="text-xl font-bold mb-10">Oraret e Autobusit</h3>
                    <ul>
                        {busSchedules.filter((schedule) => {
                            const departureDate = new Date(schedule.departure);
                            const currentDate = new Date();
                            return departureDate.getTime() > currentDate.getTime();
                        }).map((schedule) => {
                            const dateTimeString = schedule.departure;
                            const arrivalDateTimeString = schedule.arrival;
                            const dateTime = new Date(dateTimeString);
                            const arrivalDateTime = new Date(arrivalDateTimeString);
                            const departureDate = dateTime.toLocaleDateString();
                            const departureTime = dateTime.toLocaleTimeString();
                            const arrivalDate = arrivalDateTime.toLocaleDateString();
                            const arrivalTime = arrivalDateTime.toLocaleTimeString();

                            const totalPrice = schedule.price * passengerCount;

                            return (
                                <div className="bg-white rounded-lg shadow-md overflow-hidden w-[750px] mb-10">
                                    <div className="flex items-center px-4 py-2 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900 mr-2">
                                            {schedule.startCityName} <span> - {departureDate} {departureTime}</span>
                                        </h3>
                                    </div>
                                    <div className="flex items-center px-4 py-2 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900 mr-2">
                                            {schedule.destinationCityName} <span> - {arrivalDate} {arrivalTime}</span>
                                        </h3>
                                    </div>
                                    <div className="flex items-center px-4 py-2">
                                        <div>
                                            <p className="ml-auto text-sm text-orange-400">{totalPrice}&#8364;</p>
                                            <p className="text-gray-500 text-sm">{schedule.operatorName}</p>
                                        </div>
                                        <button className="text-sm focus:outline-none ml-auto text-orange-400">
                                            Shiko detajet
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Lines;
