import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar"

const Home = () => {
    const navigate = useNavigate();
    const [startCity, setStartCity] = useState("");
    const [destinationCity, setDestinationCity] = useState("");
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
                    passengerCount
                }
            });
        }
    };

    return (
        <>
            <NavBar />
            <div className="flex justify-center items-center">
                <div className="max-w-sm lg:max-w-full lg:flex justify-center items-center space-x-2 overflow-hidden shadow-lg px-6 py-4 flex rounded">
                    {error && (
                        <p className="text-red-500">Please select both start and destination cities.</p>
                    )}
                    <div>
                        <h2 className="text-xl font-bold">Udheto lehte. Destinacioni i radhes?</h2>
                        <p>Kerko & rezervo bileta te autobusit dhe oferta te ushetimit</p>
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="flex items-center">
                                <input
                                    className="w-10 p-1 rounded-md border border-gray-300"
                                    type="number"
                                    name="passengerCount"
                                    id="passengerCount"
                                    value={passengerCount}
                                    onChange={handleInputChanges}
                                />
                                <p className="ml-2">Pasagjer</p>
                            </div>
                            <div className="flex mt-2 space-x-2">
                                <select
                                    name="StartCityId"
                                    id="StartCityId"
                                    onChange={handleInputChanges}
                                    value={startCity}
                                    className="flex-grow p-1 rounded-md border border-gray-300"
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
                                    className="flex-grow p-1 rounded-md border border-gray-300"
                                >
                                    <option value="" disabled>Select Destination City</option>
                                    {cities.filter(city => city.name !== startCity).map(city => (
                                        <option key={city.id} value={city.name}>{city.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="date"
                                    className="flex-grow p-1 rounded-md border border-gray-300"
                                />
                                <button type="submit" className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm text-center flex-grow dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900 mt-2 p-1 rounded-md w-20">
                                    Kerko
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
