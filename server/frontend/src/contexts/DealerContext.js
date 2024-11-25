/**
 * DealerContext.js
 * Provides a context for managing dealer data (`dealers`), loading state (`loading`), and errors (`error`).
 * Fetches dealer data from the server on mount using `get_dealers` and updates the state accordingly.
 */
import React, { createContext, useState, useEffect } from 'react';

export const DealerContext = createContext();

const DealerProvider = ({ children }) => {
    const [dealers, setDealers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const dealer_url = "/djangoapp/get_dealers";

    const get_dealers = async () => {
        try {
            const res = await fetch(dealer_url, { method: "GET" });
            const retobj = await res.json();
            if (retobj.status === 200) {
                setDealers(Array.from(retobj.dealers));
                setError(false);
                setLoading(false);
            }
        } catch (error) {
            setError(true);
            console.error("Failed to fetch dealers:", error);
        }
    };

    useEffect(() => {
        get_dealers();
    }, []);

    return (
        <DealerContext.Provider value={{ dealers, loading, error }}>
            {children}
        </DealerContext.Provider>
    );
};

export default DealerProvider;
