import React, { createContext, useState } from "react";
import Toastify from 'toastify-js';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currUser, setCurrUser] = useState(() => {
        const savedUser = localStorage.getItem('currUser');
        return savedUser ? JSON.parse(savedUser) : {};
    });
    const [location, setLocation] = useState(null)

    const login = (username, user_type, dealer_id, firstname, lastname) => {
        const userInfo = { username, user_type, dealer_id, firstname, lastname};
        setCurrUser(userInfo);
        localStorage.setItem('currUser', JSON.stringify(userInfo));
    };


    const getUserLocation = () => {
        if (navigator.geolocation) {
            Toastify({
                text: "We need access to your location to show nearby dealers.",
                duration: 5000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #4CAF50, #43A047)",
            }).showToast();
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            }, (error) => {
                console.error("Error getting location:", error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const logout = () => {
        setCurrUser({});
        localStorage.removeItem('currUser');
    };

    return (
        <UserContext.Provider value={{ currUser, login, logout, getUserLocation, location }}>
            {children}
        </UserContext.Provider>
    );
};
