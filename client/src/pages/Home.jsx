import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar"
import TravelTo from "../components/TravelTo";

const Home = () => {
    const navigate = useNavigate();
    const [startCity, setStartCity] = useState("");
    const [destinationCity, setDestinationCity] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [passengerCount, setPassengerCount] = useState(1);
    const [cities, setCities] = useState([]);
    const [error, setError] = useState(false);

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

    const validateStartCity = () => {
        setError(startCity === "");
    };

    const validateDestinationCity = () => {
        setError(destinationCity === "");
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
        } else if (name === "departureTime") {
            setDepartureTime(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        validateStartCity();
        validateDestinationCity();

        if (startCity === "" || destinationCity === "") {
            setError(true); // Set error state to true if any required field is empty
            return; // Stop further execution
        }

        if (!error) {
            navigate('/lines', {
                state: {
                    startCity,
                    destinationCity,
                    passengerCount,
                    departureTime
                }
            });
        }
    };

    return (
        <>
            <NavBar />
            <div className="flex-col flex justify-center items-center mt-10">
                <div className="max-w-sm lg:max-w-full lg:flex justify-center items-center space-x-2 overflow-hidden shadow-2xl px-6 py-4 flex rounded">
                    <div>
                        <h2 className="text-2xl text-orange-400 font-extralight">Udheto lehte. Destinacioni i radhes?</h2>
                        <p className="text-gray-400 font-light">Kerko & rezervo bileta te autobusit dhe oferta te udhetimit</p>
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="flex items-center">
                                <input
                                    className="w-10 p-1 rounded-md border border-gray-100"
                                    type="number"
                                    name="passengerCount"
                                    id="passengerCount"
                                    min='0'
                                    max='10'
                                    value={passengerCount}
                                    onChange={handleInputChanges}
                                />
                                <p className="ml-2">Numri i udhetareve</p>
                            </div>
                            <div className="flex mt-2 space-x-2">
                                <select
                                    name="StartCityId"
                                    id="StartCityId"
                                    onChange={handleInputChanges}
                                    value={startCity}
                                    className="flex-grow p-1 rounded-md border border-gray-100"
                                >
                                    <option value="" disabled>Zgjedh pikenisjen</option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.name}>{city.name}</option>
                                    ))}
                                </select>
                                <select
                                    name="DestinationCityId"
                                    id="DestinationCityId"
                                    onChange={handleInputChanges}
                                    value={destinationCity}
                                    className="flex-grow p-1 rounded-md border border-gray-100"
                                >
                                    <option value="" disabled>Zgjedh destinacionin</option>
                                    {cities.filter(city => city.name !== startCity).map(city => (
                                        <option key={city.id} value={city.name}>{city.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="date"
                                    name="departureTime"
                                    id="departureTime"
                                    onChange={handleInputChanges}
                                    value={departureTime}
                                    min={new Date().toISOString().slice(0, 10)} // Set the minimum date to the current date
                                    className="flex-grow p-1 rounded-md border border-gray-100"
                                />
                                <button type="submit" className="text-orange-400 hover:text-white border border-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm text-center flex-grow dark:border-orange-400 dark:text-orange-400 dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900 mt-2 p-1 w-20">
                                    Kerko
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="mt-5">
                    {error && (
                        <p className="text-red-500">Ju lutem zgjedhini pikenisjen dhe destinacionin tuaj.</p>
                    )}
                </div>
            </div>
            <TravelTo />
        </>
    );
};

export default Home;
