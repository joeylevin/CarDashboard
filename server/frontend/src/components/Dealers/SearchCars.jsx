// SearchCars.jsx
//
// This component displays a list of cars available at a specific dealer, 
// fetched from the backend API. Users can filter cars by various criteria 
// such as make, model, year, mileage, and price. It includes options to 
// reset filters and dynamically updates the displayed cars based on user input.
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';
import './SearchCars.css';

const SearchCars = () => {
    const [cars, setCars] = useState([]);
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [dealer, setDealer] = useState({ "full_name": "" });
    const [message, setMessage] = useState("Loading Cars....");
    const { id } = useParams();

    let dealer_url = `/djangoapp/get_inventory/${id}`;
    let fetch_url = `/djangoapp/dealer/${id}`;

    const fetchDealer = async () => {
        try {
            const res = await fetch(fetch_url, {
                method: "GET"
            });
            const retobj = await res.json();
            if (retobj.status === 200) {
                let dealer = retobj.dealer;
                setDealer({ "full_name": dealer[0].full_name })
            }
        } catch (err) {
            console.error("Error fetching dealer", err);
        }
    }

    const fetchCars = async () => {
        try {
            const res = await fetch(dealer_url, {
                method: "GET"
            });
            const retobj = await res.json();

            if (retobj.status === 200) {
                let cars = Array.from(retobj.cars)
                setCars(cars);
                populateMakesAndModels(cars);
            }
        } catch (err) {
            console.error("Error fetching cars", err)
        }
    }

    const populateMakesAndModels = (cars) => {
        let tmpmakes = []
        let tmpmodels = []
        cars.forEach((car) => {
            tmpmakes.push(car.make)
            tmpmodels.push(car.model)
        })
        setMakes(Array.from(new Set(tmpmakes)));
        setModels(Array.from(new Set(tmpmodels)));
    }

    const setCarsmatchingCriteria = async (matching_cars) => {
        let cars = Array.from(matching_cars)

        let makeIdx = document.getElementById('make').selectedIndex;
        let modelIdx = document.getElementById('model').selectedIndex;
        let yearIdx = document.getElementById('year').selectedIndex;
        let mileageIdx = document.getElementById('mileage').selectedIndex;
        let priceIdx = document.getElementById('price').selectedIndex;

        if (makeIdx !== 0) {
            let currmake = document.getElementById('make').value;
            cars = cars.filter(car => car.make === currmake);
        }
        if (modelIdx !== 0) {
            let currmodel = document.getElementById('model').value;
            cars = cars.filter(car => car.model === currmodel);
            if (cars.length !== 0) {
                document.getElementById('make').value = cars[0].make;
            }
        }

        if (yearIdx !== 0) {
            let curryear = document.getElementById('year').value;
            cars = cars.filter(car => car.year >= curryear);
            if (cars.length !== 0) {
                document.getElementById('make').value = cars[0].make;
            }
        }

        if (mileageIdx !== 0) {
            let currmileage = parseInt(document.getElementById('mileage').value);
            if (currmileage === 50000) {
                cars = cars.filter(car => car.mileage <= currmileage);
            } else if (currmileage === 100000) {
                cars = cars.filter(car => car.mileage <= currmileage && car.mileage > 50000);
            } else if (currmileage === 150000) {
                cars = cars.filter(car => car.mileage <= currmileage && car.mileage > 100000);
            } else if (currmileage === 200000) {
                cars = cars.filter(car => car.mileage <= currmileage && car.mileage > 150000);
            } else {
                cars = cars.filter(car => car.mileage > 200000);
            }
        }

        if (priceIdx !== 0) {
            let currprice = parseInt(document.getElementById('price').value);
            if (currprice === 20000) {
                cars = cars.filter(car => car.price <= currprice);
            } else if (currprice === 40000) {
                cars = cars.filter(car => car.price <= currprice && car.price > 20000);
            } else if (currprice === 60000) {
                cars = cars.filter(car => car.price <= currprice && car.price > 40000);
            } else if (currprice === 80000) {
                cars = cars.filter(car => car.price <= currprice && car.price > 60000);
            } else {
                cars = cars.filter(car => car.price > 80000);
            }
        }

        if (cars.length === 0) {
            setMessage("No cars found matching criteria");
        }
        setCars(cars);
    }


    let SearchCarsByMake = async () => {
        let make = document.getElementById("make").value;
        if (make !== "all") {
            dealer_url = dealer_url + "?make=" + make;
        }
        const res = await fetch(dealer_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const retobj = await res.json();

        if (retobj.status === 200) {
            setCarsmatchingCriteria(retobj.cars);
        }
    }

    let SearchCarsByModel = async () => {
        let model = document.getElementById("model").value;
        if (model !== "all") {
            dealer_url = dealer_url + "?model=" + model;
        }

        const res = await fetch(dealer_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const retobj = await res.json();

        if (retobj.status === 200) {
            setCarsmatchingCriteria(retobj.cars);
        }
    }

    let SearchCarsByYear = async () => {
        let year = document.getElementById("year").value;
        if (year !== "all") {
            dealer_url = dealer_url + "?year=" + year;
        }

        const res = await fetch(dealer_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const retobj = await res.json();

        if (retobj.status === 200) {
            setCarsmatchingCriteria(retobj.cars);
        }
    }

    let SearchCarsByMileage = async () => {
        let mileage = document.getElementById("mileage").value;
        if (mileage !== "all") {
            dealer_url = dealer_url + "?mileage=" + mileage;
        }

        const res = await fetch(dealer_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const retobj = await res.json();

        if (retobj.status === 200) {
            setCarsmatchingCriteria(retobj.cars);
        }
    }


    let SearchCarsByPrice = async () => {
        let price = document.getElementById("price").value;
        if (price !== "all") {
            dealer_url = dealer_url + "?price=" + price;
        }

        const res = await fetch(dealer_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const retobj = await res.json();

        if (retobj.status === 200) {
            setCarsmatchingCriteria(retobj.cars);
        }
    }

    const reset = () => {
        const selectElements = document.querySelectorAll('select');

        selectElements.forEach((select) => {
            select.selectedIndex = 0;
        });
        fetchCars();
    }


    useEffect(() => {
        fetchCars();
        fetchDealer();
    }, []);

    return (
        <div>
            <Header />
            <h1 className="search-cars-title">Cars at {dealer.full_name}</h1>
            <div>
                <div className="filters-container">
                    <label className="filter-label">Make</label>
                    <select className="filter-select" id="make" onChange={SearchCarsByMake}>
                        {makes.length === 0 ? (
                            <option value=''>No data found</option>
                        ) : (
                            <>
                                <option defaultValue value='all'> -- All -- </option>
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
                    <select className="filter-select" id="model" onChange={SearchCarsByModel}>
                        {models.length === 0 ? (
                            <option value=''>No data found</option>
                        ) : (
                            <>
                                <option defaultValue value='all'> -- All -- </option>
                                {models.map((model, index) => (
                                    <option key={index} value={model}>
                                        {model}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>
                    <label className="filter-label">Year</label>
                    <select className="filter-select" id="year" onChange={SearchCarsByYear}>
                        <option selected value='all'> -- All -- </option>
                        <option value='2024'>2024 or newer</option>
                        <option value='2023'>2023 or newer</option>
                        <option value='2022'>2022 or newer</option>
                        <option value='2021'>2021 or newer</option>
                        <option value='2020'>2020 or newer</option>
                    </select>
                    <label className="filter-label">Mileage</label>
                    <select className="filter-select" id="mileage" onChange={SearchCarsByMileage}>
                        <option selected value='all'> -- All -- </option>
                        <option value='50000'>Under 50000</option>
                        <option value='100000'>50000 - 100000</option>
                        <option value='150000'>100000 - 150000</option>
                        <option value='200000'>150000 - 200000</option>
                        <option value='200001'>Over 200000</option>
                    </select>
                    <label className="filter-label">Price</label>
                    <select className="filter-select" name="price" id="price" onChange={SearchCarsByPrice}>
                        <option selected value='all'> -- All -- </option>
                        <option value='20000'>Under 20000</option>
                        <option value='40000'>20000 - 40000</option>
                        <option value='60000'>40000 - 60000</option>
                        <option value='80000'>60000 - 80000</option>
                        <option value='80001'>Over 80000</option>
                    </select>

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
                            <div>
                                <div className="car-card" key={car._id}>
                                    <h3>{car.make} {car.model}</h3>
                                    <p>Year: {car.year}</p>
                                    <p>Mileage: {car.mileage}</p>
                                    <p>Price: {car.price}</p>
                                </div>
                                <hr />
                            </div>
                        )
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchCars;