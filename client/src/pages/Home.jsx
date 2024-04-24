// Home.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const [startCity, setStartCity] = useState("");
    const [destinationCity, setDestinationCity] = useState("");
    const [passengerCount, setPassengerCount] = useState(1);
    const [error, setError] = useState(false);

    const validateStartCity = () => {
        if (startCity === "") {
            setError(true);
        } else {
            setError(false);
        }
    };

    const validateDestinationCity = () => {
        if (destinationCity === "") {
            setError(true);
        } else {
            setError(false);
        }
    };

    const handleInputChanges = (e) => {
        const { name, value } = e.target;
        setError(false);
        if (name === "StartCityId") {
            setStartCity(value);
        } else if (name === "DestinationCityId") {
            setDestinationCity(value);
        } else if (name === "passengerCount") {
            setPassengerCount(Number(value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        validateStartCity();
        validateDestinationCity();

        if (!error) {
            navigate('/lines', {
                state: {
                    startCity,
                    destinationCity,
                    passengerCount
                }
            });
        }
    };

    return (
        <div>
            <div>
                <h2>Udheto lehte. Destinacioni i radhes?</h2>
                <p>Kerko & rezervo bileta te autobusit dhe oferta te ushetimit</p>
                <form onSubmit={handleSubmit}>
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
                    <div className="flex">
                        <select
                            name="StartCityId"
                            id="StartCityId"
                            onChange={handleInputChanges}
                        >
                            <option value="" defaultValue="0">
                                Nisja
                            </option>
                            <option value="Prishtina">Prishtina</option>
                            {/* Add other city options similarly */}
                        </select>
                        <select
                            name="DestinationCityId"
                            id="DestinationCityId"
                            onChange={handleInputChanges}
                        >
                            <option value="" defaultValue="0">
                                Destinacioni
                            </option>
                            <option value="Shkup">Shkup</option>
                            {/* Add other city options similarly */}
                        </select>
                        <input type="date" />
                        <button type="submit" className="w-20 h-10 bg-primary">
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Home;
