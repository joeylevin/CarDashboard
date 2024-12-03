// CarList.jsx
//
// This component displays all cars available,
// fetched from the backend API. Users can filter cars by various criteria 
// such as make, model, year, mileage, and price. It includes options to 
// reset filters and dynamically updates the displayed cars based on user input.
import React, { useState, useEffect, useContext } from 'react';
import '../Dealers/SearchCars.css';
import './CarList.css';
import { DealerContext } from '../../contexts/DealerContext';
import RangeSlider from './RangeSlider';

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const { dealers } = useContext(DealerContext);
    const [message, setMessage] = useState("Loading Cars....");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        mileage: [0, 200000],
        price: [0, 100000],
        make: 'all',
        model: 'all',
        year: 'all',
    });

    const [limit, setLimit] = useState(10)
    const [resetSlider, setResetSlider] = useState(false);

    let dealer_url = `/djangoapp/full_inventory`;


    const fetchCars = async (page = 1) => {
        try {
            const queryParams = new URLSearchParams({ page, limit });
            if (filters.mileage[0] !== 0 || filters.mileage[1] !== 200000) {
                queryParams.append('mileageMin', filters.mileage[0])
                queryParams.append('mileageMax', filters.mileage[1]);
            }
            if (filters.price[0] !== 0 || filters.price[1] !== 100000) {
                queryParams.append('priceMin', filters.price[0]);
                queryParams.append('priceMax', filters.price[1]);
            }
            if (filters.make !== 'all') queryParams.append('make', filters.make);
            if (filters.model !== 'all') queryParams.append('model', filters.model);
            if (filters.year !== 'all') queryParams.append('year', filters.year);

            const res = await fetch(`${dealer_url}?${queryParams.toString()}`, { method: "GET" });

            const retobj = await res.json();

            if (retobj.status === 200) {
                if (!Array.isArray(retobj.cars) || retobj.cars.length === 0) {
                    setCars(retobj.cars);
                    setMessage("No cars found.");
                    setCurrentPage(1);
                    setTotalPages(1);
                    setMakes([]); // Clear makes if no cars are provided
                    setModels([]); // Clear models if no cars are provided
                }
                else {
                    setCars(retobj.cars);
                    setTotalPages(retobj.totalPages);
                    setCurrentPage(retobj.currentPage);
                    populateMakesAndModels(retobj.cars);
                }
            }
            else {
                setMessage("No cars found.");
            }
        } catch (err) {
            console.error("Error fetching cars", err)
            setMessage("Error loading cars.");
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const populateMakesAndModels = (cars) => {
        const tmpMakes = new Set(cars.map(car => car.make));
        const tmpModels = new Set(cars.map(car => car.model));
        setMakes([...tmpMakes]);
        setModels([...tmpModels]);
    }


    let carLocation = (dealerID) => {
        const cur = dealers[dealerID];
        return cur.city+', '+cur.state+' '+cur.zip
    }

    const filtersChanged = () => {
        if (filters.mileage[0] !== 0 
            || filters.mileage[1] !== 200000
            || filters.price[0] !== 0
            || filters.price[1] !== 100000
            || filters.make !== 'all'
            || filters.model !== 'all'
            || filters.year !== 'all')
                return true;
        else return false;
    }

    const reset = () => {
        if (filtersChanged()) {
            setFilters({
                mileage: [0, 200000],
                price: [0, 100000],
                make: 'all',
                model: 'all',
                year: 'all',
            });
            setCurrentPage(1);
            setResetSlider(true); // Trigger reset in RangeSlider
            setTimeout(() => setResetSlider(false), 0);
        }
    }

    const handleFilterChange = (e) => {
        const { id, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [id]: value,
        }));
    };

    const handleRangeChange = (newValues, type) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [type]: newValues,
        }));
    };

    useEffect(() => {
        fetchCars(currentPage);
    }, [filters, currentPage]);

    return (
        <div>
            <h1 className="search-cars-title">Full car list</h1>
            <div>
                <div className="filters-container">
                    <label className="filter-label">Make</label>
                    <select className="filter-select" id="make" value={filters.make} onChange={handleFilterChange}>
                        {makes.length === 0 ? (
                            <option value=''>No data found</option>
                        ) : (
                            <>
                                <option value="all"> -- All -- </option>
                                {makes.map((make, index) => (
                                    <option key={index} value={make}>
                                        {make}
                                    </option>
                                ))}
                            </>
                        )
                        }
                    </select>
                    <label className="filter-label">Model</label>
                    <select className="filter-select" id="model" value={filters.model} onChange={handleFilterChange}>
                        {models.length === 0 ? (
                            <option value=''>No data found</option>
                        ) : (
                            <>
                                <option value='all'> -- All -- </option>
                                {models.map((model, index) => (
                                    <option key={index} value={model}>
                                        {model}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>
                    <label className="filter-label">Year</label>
                    <select className="filter-select" id="year" value={filters.year} onChange={handleFilterChange}>
                        <option selected value='all'> -- All -- </option>
                        <option value='2024'>2024 or newer</option>
                        <option value='2023'>2023 or newer</option>
                        <option value='2022'>2022 or newer</option>
                        <option value='2021'>2021 or newer</option>
                        <option value='2020'>2020 or newer</option>
                    </select>
                    <label for="mileage" className="filter-label">Mileage</label>
                    <RangeSlider 
                        values={filters.mileage} 
                        onFinalChange={(newVal) => handleRangeChange(newVal, 'mileage')}
                        min={0} 
                        max={200000} 
                        step={2500} 
                        className="mileage-slider" 
                        label="Mileage" 
                        reset={resetSlider}
                    />

                    <label for="price" className="filter-label">Price</label>
                    <RangeSlider 
                        values={filters.price} 
                        onFinalChange={(newPrice) => handleRangeChange(newPrice, 'price')}
                        min={0} 
                        max={100000} 
                        step={1000} 
                        className="price-slider" 
                        label="Price" 
                        reset={resetSlider}
                    />
                    <button className="reset-button" onClick={reset}>Reset</button>
                </div>
            </div>


            <div className="cars-list-container" >
                {cars.length === 0 ? (
                    <p className="loading-message">{message}</p>
                ) : (
                    <div>
                        <hr />
                        {cars.map((car) => (
                            <div key={car._id}>
                                <div className="car-card">
                                    <h3>{car.make} {car.model}</h3>
                                    <p>Year: {car.year}</p>
                                    <p>Mileage: {car.mileage}</p>
                                    <p>Price: {car.price}</p>
                                    <p>Location: {carLocation(car.dealer_id)}</p>
                                </div>
                                <hr />
                            </div>
                        )
                        )}

                    </div>
                )}
            </div>
            <div className="pagination-controls">
                <button 
                    onClick={handlePreviousPage} 
                    disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default CarList;