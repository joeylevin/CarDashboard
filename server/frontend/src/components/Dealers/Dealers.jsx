//  Dealers.jsx
//  This component displays a list of car dealerships with a search and review functionality.
//  Fetches a list of dealerships from the backend and displays them in a table format.
//  Provides a search bar to filter dealerships by state in real-time.
//  Displays key dealership details such as ID, name, city, address, zip code, and state.
//  Allows logged-in users to navigate to a "Post Review" page for a dealership.

import React, { useState, useEffect, useContext } from 'react';
import { getDistance } from 'geolib';
import "./Dealers.css";
import "../assets/style.css";
import review_icon from "../assets/reviewicon.png"
import { useDebounce } from "use-debounce";
import { DealerContext } from '../../contexts/DealerContext';
import { UserContext } from '../../contexts/UserContext';
import { displayDistance } from '../../utils/helpers';

const Dealers = () => {
    const [dealersList, setDealersList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery] = useDebounce(searchQuery, 300);
    const { currUser, location, getUserLocation } = useContext(UserContext);
    const { dealers, error, loading } = useContext(DealerContext);

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleLostFocus = () => {
        if (!searchQuery) {
            setDealersList(dealers);
        }
    }

    const locationHelper = (lat, long) => {
        try {
            return displayDistance(getDistance(
                { latitude: location.latitude, longitude: location.longitude },
                { latitude: lat, longitude: long })
            )
        } catch (err) {
            console.log("err location display", err);
            return "N/A"
        } 
    }

    useEffect(() => {
        const filtered = dealers.filter(dealer =>
            dealer.state.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            dealer.city.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            dealer.full_name.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        setDealersList(filtered);
    }, [debouncedQuery, dealers]);

    useEffect(() => {
        getUserLocation();
    }, []);


    if (error) {
        return <div className="error-message">Error Loading Dealers. Please check your connection</div>;
    }

    // Show loading message while data is being fetched
    if (loading) {
        return <div className="loading-message">Loading dealers...</div>;
    }

    if (Object.keys(dealersList).length === 0) {
        return <div className="loading-message">No dealers found. Please check your connection.</div>;
    }

    return (
        <div className='dealers-container'>
            <div className='search-container'>
                <input
                    type="text"
                    placeholder="Search states, cities, or dealer names..."
                    aria-label="Search by state, city, or dealer name"
                    onChange={handleInputChange}
                    onBlur={handleLostFocus}
                    value={searchQuery}
                />
            </div>
            <table className='table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Dealer Name</th>
                        <th>City</th>
                        <th>Address</th>
                        <th>Zip</th>
                        <th>State</th>
                        {location.found && <th>Distance</th>}
                        {currUser.username && <th>Review Dealer</th>}
                    </tr>
                </thead>
                <tbody>
                    {dealersList.map(dealer => (
                        <tr key={dealer.id}>
                            <td>{dealer['id']}</td>
                            <td><a href={'/dealer/' + dealer['id']}>{dealer['full_name']}</a></td>
                            <td>{dealer['city']}</td>
                            <td>{dealer['address']}</td>
                            <td>{dealer['zip']}</td>
                            <td>{dealer['state']}</td>
                            <td>{location.found && locationHelper(dealer.lat, dealer.long)}
                            </td>
                            {currUser.username ? (
                                <td><a href={`/postreview/${dealer['id']}`}><img src={review_icon} className="review_icon" alt="Post Review" /></a></td>
                            ) : <></>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Dealers
