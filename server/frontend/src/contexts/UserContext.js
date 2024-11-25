/**
 * UserContext.js
 * This file defines a UserContext using React's Context API to manage user authentication and location data.
 * It provides a UserProvider component that wraps the application and allows access to user information, 
 * login/logout functionality, and geolocation. The current user's data is stored in localStorage for persistence.
 */
import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currUser, setCurrUser] = useState(() => {
        const savedUser = localStorage.getItem('currUser');
        return savedUser ? JSON.parse(savedUser) : {};
    });
    const [location, setLocation] = useState({ latitude: null, longitude: null, found: false });

    const login = (username, user_type, dealer_id, firstname, lastname) => {
        const userInfo = { username, user_type, dealer_id, firstname, lastname};
        if (JSON.stringify(currUser) !== JSON.stringify(userInfo)) {
            setCurrUser(userInfo);
            localStorage.setItem('currUser', JSON.stringify(userInfo));
        }
    };


    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude, found: true });
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
