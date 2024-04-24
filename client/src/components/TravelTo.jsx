import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Import images
import ShkupiLogo from '../assets/Shkupi.png';
import PrishtinaLogo from '../assets/Prishtina.png';
import TiranaLogo from '../assets/Tirana.png';

const TravelTo = () => {
    const navigate = useNavigate();
    const [startCity, setStartCity] = useState("");
    const [passengerCount, setPassengerCount] = useState(1);

    const handleSubmit = (cityName) => {
        setStartCity(cityName); // Update startCity state immediately

        navigate('/lines', {
            state: {
                startCity: cityName, // Pass the updated cityName directly
                passengerCount 
            }
        });
    };

    // Define data 
    const logos = [
        {
            image: ShkupiLogo,
            text: 'Shkup',
        },
        {
            image: PrishtinaLogo,
            text: 'Prishtina',
        },
        {
            image: TiranaLogo,
            text: 'Tirana',
        },
    ];

    return (
        <div>
            <ul>
                {logos.map((logo) => (
                    <li key={logo.text}>
                        <img src={logo.image} alt={logo.text}/>
                        <p value={startCity}>{logo.text}</p>
                        <button onClick={() => handleSubmit(logo.text)}>
                            Shiko linjen
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TravelTo;
