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
            }
        } catch (error) {
            setError(true);
            console.error("Failed to fetch dealers:", error);
        } finally {
            setLoading(false);
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
