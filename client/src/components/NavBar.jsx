import { useState } from "react";

// Images Imports
import BusLogo from "../assets/BusLogo.svg";
import UserOrange from "../assets/UserSvg-orange.svg";

import { Link } from 'react-router-dom';


const NavBar = (props) => {

    const isLoggedIn = props.isLoggedIn;

    return (

        <nav className="flex flex-row items-center py-5 px-5 justify-between w-full">
            <div className="flex items-center">
                <img src={BusLogo} alt="Buslines Logo " />
                <h1 className="text-3xl ml-1 font-semibold flex text-offBlack">Bus <p className="text-primary">Lines</p></h1>
            </div>
            {!isLoggedIn ?
                <Link to="./login">
                    <img src={UserOrange} alt="Log In Page" />
                </Link> :
                <Link to="./profile">
                    <img src={UserOrange} alt="Your Profile" />
                </Link>
            }
            

        </nav>
    );
};

export default NavBar;
