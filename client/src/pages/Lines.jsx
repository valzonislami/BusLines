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
        let apiUrl = `https://localhost:7264/BusSchedule?startCityName=${startCity}`;

        if (destinationCity) {
            apiUrl += `&destinationCityName=${destinationCity}`;
        }

        if (departureTime) {
            apiUrl += `&departureDate=${departureTime}`;
        }

        axios.get(apiUrl)
            .then((response) => {
                setBusSchedules(response.data);
            })
            .catch((error) => {
                console.error("Error fetching bus schedules:", error);
            });
    }, [startCity, destinationCity, departureTime]);

    return (
        <>
            <div>
                <NavBar />
                <div className="flex justify-center items-center mt-10">
                    <div>
                        <h3 className="text-2xl font-medium mb-10">Oraret e Autobusit</h3>
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
                                const departureTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                const arrivalDate = arrivalDateTime.toLocaleDateString();
                                const arrivalTime = arrivalDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                const totalPrice = schedule.price * passengerCount;

                                return (
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden w-[750px] mb-10">
                                        <div className="flex items-center px-4 py-2 border-b border-gray-200 justify-between">
                                            <h3 className="text-lg font-normal text-gray-900 mr-2">
                                                <span className="text-orange-400">&#x21B3;</span>{schedule.startCityName}
                                            </h3>
                                            <div className='flex'>
                                                <h3>{departureDate} at  {departureTime}</h3>
                                            </div>
                                        </div>
                                        <div className="flex items-center px-4 py-2 border-b border-gray-200 justify-between">
                                            <h3 className="text-lg font-normal text-gray-900 mr-2">
                                                <span className="text-orange-400">&#x21B3;</span>{schedule.destinationCityName}
                                            </h3>
                                            <div className='flex'>
                                                <h3>{arrivalDate} at  {arrivalTime}</h3>
                                            </div>
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
        </>
    );
};

export default Lines;
