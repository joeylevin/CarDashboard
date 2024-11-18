//  Dealers.jsx
//  This component displays a list of car dealerships with a search and review functionality.
//  Fetches a list of dealerships from the backend and displays them in a table format.
//  Provides a search bar to filter dealerships by state in real-time.
//  Displays key dealership details such as ID, name, city, address, zip code, and state.
//  Allows logged-in users to navigate to a "Post Review" page for a dealership.

import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"
import { useDebounce } from "use-debounce";

const Dealers = () => {
    const [dealersList, setDealersList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [originalDealers, setOriginalDealers] = useState([]);
    const [debouncedQuery] = useDebounce(searchQuery, 300);
    const dealer_url = "/djangoapp/get_dealers";
    const isLoggedIn = !!sessionStorage.getItem("username");

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleLostFocus = () => {
        if (!searchQuery) {
            setDealersList(originalDealers);
        }
    }

    const get_dealers = async () => {
        const res = await fetch(dealer_url, {
            method: "GET"
        });
        const retobj = await res.json();
        if (retobj.status === 200) {
            let all_dealers = Array.from(retobj.dealers)
            setDealersList(all_dealers)
            setOriginalDealers(all_dealers);
        }
    }

    useEffect(() => {
        const filtered = originalDealers.filter(dealer =>
            dealer.state.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            dealer.city.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            dealer.full_name.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        setDealersList(filtered);
    }, [debouncedQuery, originalDealers]);

    useEffect(() => {
        get_dealers();
    }, []);

    return (
        <div>
            <table className='table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Dealer Name</th>
                        <th>City</th>
                        <th>Address</th>
                        <th>Zip</th>
                        <th>
                            <input
                                type="text"
                                placeholder="Search states, cities, or dealer names..."
                                aria-label="Search by state, city, or dealer name"
                                onChange={handleInputChange}
                                onBlur={handleLostFocus}
                                value={searchQuery}
                            />
                        </th>
                        {isLoggedIn && <th>Review Dealer</th>}
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
                            {isLoggedIn ? (
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
