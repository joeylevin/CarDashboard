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
import review_icon from "../assets/reviewicon.png";
import { useDebounce } from "use-debounce";
import { DealerContext } from '../../contexts/DealerContext';
import { UserContext } from '../../contexts/UserContext';
import { displayDistance } from '../../utils/helpers';

const Dealers = () => {
    const [dealersList, setDealersList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery] = useDebounce(searchQuery, 300);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const { currUser, location, getUserLocation } = useContext(UserContext);
    const { dealers, error, loading } = useContext(DealerContext);
    const [distanceList, setDistanceList] = useState({});

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value.trimStart());
    };

    const handleLostFocus = () => {
        if (!searchQuery && dealersList !== dealers) {
            setDealersList(dealers);
        }
    };

    const updateDistanceList = (dealers) => {
        if (!location || !location.found) {
            setDistanceList({});
            return;
        }
        setDistanceList((prevState) => {
            const updatedDistances = { ...prevState };

            dealers.forEach(dealer => {
                if (!updatedDistances[dealer.id]) {
                    if (dealer.lat && dealer.long) {
                        updatedDistances[dealer.id] = getDistance(
                            { latitude: location.latitude, longitude: location.longitude },
                            { latitude: dealer.lat, longitude: dealer.long }
                        );
                    }
                }
            });

            return updatedDistances;
        });
    };

    useEffect(() => {
        updateDistanceList(dealers);
    }, [dealers, location]);

    const sortDealers = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sortedDealers = [...dealersList].sort((a, b) => {
            let valueA = a[key];
            let valueB = b[key];

            if (key === "distance") {
                valueA = distanceList[a.id] || Infinity;
                valueB = distanceList[b.id] || Infinity;
            }

            if (valueA == null || valueB == null) {
                return valueA == null ? 1 : -1; // Nulls appear last
            }
            if (valueA < valueB) return direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setDealersList(sortedDealers);
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? '▲' : '▼';
        }
        return '';
    };

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

    const SortableHeader = ({ label, sortKey }) => (
        <th
            onClick={() => sortDealers(sortKey)}
            role="button"
            tabIndex="0"
            onKeyDown={(e) => e.key === 'Enter' && sortDealers(sortKey)}
        >
            {label} {getSortIndicator(sortKey)}
        </th>
    );

    if (error) {
        return <div className="error-message">Error Loading Dealers. Please check your connection</div>;
    }

    // Show loading message while data is being fetched
    if (loading) {
        return <div className="loading-message">Loading dealers...</div>;
    }

    if (!loading && dealers.length === 0) {
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
            {dealersList.length === 0 && !loading && (
                <div className="no-dealers-message">
                    No dealers found matching your search criteria.
                </div>
            )}
            <table className='table'>
                <thead>
                    <tr>
                        <SortableHeader label="ID" sortKey="id" />
                        <SortableHeader label="Dealer Name" sortKey="full_name" />
                        <SortableHeader label="City" sortKey="city" />
                        <SortableHeader label="Address" sortKey="address" />
                        <SortableHeader label="Zip" sortKey="zip" />
                        <SortableHeader label="State" sortKey="state" />
                        {location.found && <SortableHeader label="Distance" sortKey="distance" />}
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
                            {location.found && (
                                <td>{distanceList[dealer.id] ? displayDistance(distanceList[dealer.id]) : "N/A"}</td>
                            )}
                            {currUser.username ? (
                                <td><a href={`/postreview/${dealer['id']}`}><img src={review_icon} className="review_icon" alt="Post Review" /></a></td>
                            ) : null}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dealers;
