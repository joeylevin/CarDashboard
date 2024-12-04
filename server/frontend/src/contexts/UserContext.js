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

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    const [csrftoken, setCsrftoken] = useState(() => getCookie('csrftoken') || null);

    const login = (username, user_type, dealer_id, firstname, lastname) => {
        const userInfo = { username, user_type, dealer_id, firstname, lastname};
        if (JSON.stringify(currUser) !== JSON.stringify(userInfo)) {
            setCurrUser(userInfo);
            localStorage.setItem('currUser', JSON.stringify(userInfo));
        }
        const token = getCookie('csrftoken');
        if (token) {
            setCsrftoken(token);  // Store CSRF token after login
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
        setCsrftoken(null);
        localStorage.removeItem('currUser');
    };

    return (
        <UserContext.Provider value={{ currUser, login, logout, getUserLocation, location, csrftoken }}>
            {children}
        </UserContext.Provider>
    );
};
