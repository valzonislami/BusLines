import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import NavBar from "../components/NavBar"
import Line from '../components/Line';
import Footer from "../components/Footer"

const Lines = () => {
    const location = useLocation();
    const { startCity: initialStartCity, destinationCity: initialDestinationCity, passengerCount: initialPassengerCount, departureTime: initialDepartureTime } = location.state;
    const [startCity, setStartCity] = useState(initialStartCity);
    const [destinationCity, setDestinationCity] = useState(initialDestinationCity);
    const [passengerCount, setPassengerCount] = useState(initialPassengerCount);
    const [departureTime, setDepartureTime] = useState(initialDepartureTime);
    const [cities, setCities] = useState([]);
    const [busSchedules, setBusSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isLineOpen, setIsLineOpen] = useState(false);

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

    const handleDetailsClick = (schedule) => {
        const depDate = new Date(schedule.departure).toLocaleDateString();
        const depTime = new Date(schedule.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const arrDate = new Date(schedule.arrival).toLocaleDateString();
        const arrTime = new Date(schedule.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Calculate and format total price
        const totalPrice = schedule.price * passengerCount;
        const formattedTotalPrice = totalPrice;

        console.log("departureDate:", depDate);
        console.log("departureTime:", depTime);
        console.log("arrivalDate:", arrDate);
        console.log("arrivalTime:", arrTime);

        if (selectedSchedule && selectedSchedule.id === schedule.id) {
            // If the clicked schedule is already selected, close the line
            setIsLineOpen(false);
            setSelectedSchedule(null);
        } else {
            // If a different schedule is clicked, open the line with the new schedule
            setSelectedSchedule({
                ...schedule,
                departureDate: depDate,
                departureTime: depTime,
                arrivalDate: arrDate,
                arrivalTime: arrTime,
                totalPrice: formattedTotalPrice,
            });
            setIsLineOpen(true);
        }
    };

    const closeLine = () => {
        setIsLineOpen(false);
    };

    return (
        <>
                <div className='absolute right-0'>
                    {selectedSchedule && isLineOpen && (
                        <Line onClose={closeLine} schedule={selectedSchedule} departureDate={selectedSchedule.departureDate} departureTime={selectedSchedule.departureTime} arrivalDate={selectedSchedule.arrivalDate} arrivalTime={selectedSchedule.arrivalTime} totalPrice={selectedSchedule.totalPrice}>
                        </Line>
                    )}
                </div>
                <NavBar />
                <div className='flex flex-col lg:flex-row justify-center selection:bg-orange-400 selection:text-white'>
                    <div className="flex justify-center items-center mt-10 lg:mt-0 lg:mr-10">
                        <div>
                            <h3 className="text-2xl font-medium mb-10">Oraret e Autobusit</h3>
                            <ul className="space-y-10">
                                {busSchedules.filter((schedule) => {
                                    const departureDate = new Date(schedule.departure);
                                    const currentDate = new Date();
                                    return departureDate.getTime() > currentDate.getTime();
                                }).map((schedule, index) => {
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
                                        <li key={index} className="bg-white rounded-lg shadow-xl overflow-hidden w-[380px] md:w-[600px] lg:w-[750px] mb-10 hover:bg-orange-50">
                                            <div className="flex flex-row items-center px-4 py-2 border-b border-gray-200 justify-between">
                                                <h3 className="text-lg font-normal text-gray-900 lg:mr-2">
                                                    <span className="text-orange-400">&#x21B3;</span>{schedule.startCityName}
                                                </h3>
                                                <div className='flex'>
                                                    <h3 className="lg:ml-4">{departureDate} at {departureTime}</h3>
                                                </div>
                                            </div>
                                            <div className="flex flex-row items-center px-4 py-2 border-b border-gray-200 justify-between">
                                                <h3 className="text-lg font-normal text-gray-900 lg:mr-2">
                                                    <span className="text-orange-400">&#x21B3;</span>{schedule.destinationCityName}
                                                </h3>
                                                <div className='flex'>
                                                    <h3 className="lg:ml-4">{arrivalDate} at {arrivalTime}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center px-4 py-2">
                                                <div>
                                                    <p className="ml-auto text-sm text-orange-400">{totalPrice}&#8364;</p>
                                                    <p className="text-gray-500 text-sm">{schedule.operatorName}</p>
                                                </div>
                                                <button className="text-sm focus:outline-none ml-auto text-orange-400 hover:text-orange-700" onClick={() => handleDetailsClick(schedule)}>
                                                    Shiko detajet
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            <Footer />
        </>
    );
};

export default Lines;
