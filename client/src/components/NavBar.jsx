import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

// Images Imports
import BusLogo from "../assets/BusLogo.svg";
import UserOrange from "../assets/UserSvg-orange.svg";

const NavBar = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        {userId && setIsLoggedIn(true)};
    }, []);

    return (
        <nav className="flex flex-row items-center py-5 px-5 justify-between w-full">
            <Link to="../">
                <div className="flex items-center">
                    <img src={BusLogo} alt="Buslines Logo " />
                    <h1 className="text-3xl ml-1 font-semibold flex text-offBlack">Bus <span className="text-primary">Lines</span></h1>
                </div>
            </Link>
            {!isLoggedIn ?
                <Link to="../authentication"> 
                    <img src={UserOrange} alt="Log In Page" />
                </Link> :
                <Link to="../profile">
                    <img src={UserOrange} alt="Your Profile" />
                </Link>
            }
        </nav>
    );
};

export default NavBar;
