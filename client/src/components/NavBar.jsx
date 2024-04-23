import { useState } from "react";
import BusLogo from "../assets/BusLogo.svg";

const NavBar = () => {

    return (
        <>
            <nav className="flex flex-row items-center p-5 justify-between w-full">
                <div className="flex items-center">
                    <img src={BusLogo} alt="Buslines Logo " />
                    <h1 className="text-3xl ml-1 font-semibold">BusLines</h1>
                </div>
                <img src="/" alt="Your Profile" />
            </nav>
        </>
    );
}


export default NavBar;