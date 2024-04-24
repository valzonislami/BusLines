import Navbar from '../components/NavBar';
import { useState } from "react";
import axios from "axios";

const Home = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [error, setError] = useState(false);
    const [startCity, setStartCity] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [passengerCount, setPassengerCount] = useState(1); // Initialize with default value 1
    const [busSchedules, setBusSchedules] = useState([]);

    const validateStartCity = () => {
        if (startCity === '') {
            setError(true);
        } else {
            setError(false);
        }
    };

    const validateDestinationCity = () => {
        if (destinationCity === '') {
            setError(true);
        } else {
            setError(false);
        }
    };

    const handleInputChanges = (e) => {
        const { name, value } = e.target;
        setError(false); 
        if (name === 'StartCityId') {
            setStartCity(value);
        } else if (name === 'DestinationCityId') {
            setDestinationCity(value);
        } else if (name === 'passengerCount') {
            setPassengerCount(Number(value)); // Convert value to number and update state
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        validateStartCity();
        validateDestinationCity();

        if (!error) {
            axios.get(`https://localhost:7264/api/BusSchedule?startCity=${startCity}&destinationCity=${destinationCity}`)
            .then((response) => {
                setBusSchedules(response.data);
            })
            .catch((error) => {
                console.error("Error fetching bus schedules:", error);
            });
        }
    };

    return (
        <div>
            <Navbar isLoggedIn={isLoggedIn} />
            <div>
                <h2>Udheto lehte. Destinacioni i radhes?</h2>
                <p>Kerko & rezervo bileta te autobusit dhe oferta te ushetimit</p>
                <form onSubmit={handleSubmit}>
                    <div className='flex'>
                        <input className='w-10' type="number" name='passengerCount' id='passengerCount' value={passengerCount} onChange={handleInputChanges} />
                        <p>Pasagjer</p>
                    </div>
                    <div className='flex'>
                        <select name="StartCityId" id="StartCityId" onChange={handleInputChanges}>
                            <option value='' defaultValue='0'>Nisja</option>
                            <option value='Prishtina'>Prishtina</option>
                            {/* Add other city options similarly */}
                        </select>
                        <select name="DestinationCityId" id="DestinationCityId" onChange={handleInputChanges}>
                            <option value='' defaultValue='0'>Destinacioni</option>
                            <option value='Shkup'>Shkup</option>
                            {/* Add other city options similarly */}
                        </select>
                        <input type="date" />
                        <button type="submit" className='w-20 h-10 bg-primary'>Search</button>
                    </div>
                </form>
            </div>
            <div>
                {/* Display bus schedules */}
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

export default Home;
