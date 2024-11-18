import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currUser, setCurrUser] = useState(() => {
        const savedUser = localStorage.getItem('currUser');
        return savedUser ? JSON.parse(savedUser) : {};
    });

    const login = (username, user_type, dealer_id) => {
        const userInfo = { username, user_type, dealer_id };
        setCurrUser(userInfo);
        localStorage.setItem('currUser', JSON.stringify(userInfo));
    };

    const logout = () => {
        setCurrUser({});
        localStorage.removeItem('currUser');
    };

    return (
        <UserContext.Provider value={{ currUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
