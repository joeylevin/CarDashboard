//  PostReview.jsx
//  This component allows users to post a review for a dealership.
//  Allows users to input their review, car details, and purchase date.
//  Validates input to ensure all required fields are filled.
//  Sends a POST request to submit the review to the backend.
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import "./Dealers.css";
import "../assets/style.css";
import { UserContext } from '../../contexts/UserContext';

const PostReview = () => {
    const [dealer, setDealer] = useState({});
    const [reviewData, setReviewData] = useState({
        review: "",
        model: "",
        year: "",
        date: "",
    });    
    const [carmodels, setCarmodels] = useState([]);
    const { currUser } = useContext(UserContext);
    const [originalReview, setOriginalReview] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    let {id, reviewid} = useParams();

    useEffect(() => {
        if (location.state && location.state.reviewData) {
            setReviewData({
                review: location.state.reviewData.review,
                model: location.state.reviewData.car_make + " " + location.state.reviewData.car_model,
                year: location.state.reviewData.car_year,
                date: location.state.reviewData.purchase_date,
            });
            setOriginalReview({
                review: location.state.reviewData.review,
                car_make: location.state.reviewData.car_make,
                car_model: location.state.reviewData.car_model,
                year: location.state.reviewData.car_year,
                date: location.state.reviewData.purchase_date,
            });
        }
    }, [location.state]);

    const curr_url = window.location.href;
    const root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
    const dealer_url = root_url + `djangoapp/dealer/${id}`;
    const review_url = root_url + `djangoapp/add_review`;
    const carmodels_url = root_url + `djangoapp/get_cars`;
    const update_review_url = root_url + `djangoapp/put_review`;
    const currentYear = new Date().getFullYear();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReviewData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const fetchData = async (url, method = 'GET', body = null) => {
        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body
            });
            if (!res.ok) throw new Error("Network response was not ok");
            return await res.json();
        } catch (error) {
            console.error("There was an error:", error);
            alert("An error occurred while fetching data. Please try again.");
        }
    };    

    const postreview = async () => {
        const { model, review, date, year } = reviewData;

        if (!model || !review || !date || !year) {
            alert("All details are mandatory")
            return;
        }

        if (new Date(date) > new Date()) {
            alert("Purchase date cannot be in the future");
            return;
        }

        const [make_chosen, ...model_parts] = model.split(" ");
        const model_chosen = model_parts.join(" ");

        let updatedData = {};

        // Only add fields to updatedData if they have changed
        if (review !== originalReview.review) updatedData.review = review;
        if (make_chosen !== originalReview.car_make) updatedData.car_make = make_chosen;
        if (model_chosen !== originalReview.car_model) updatedData.car_model = model_chosen;
        if (year !== originalReview.year) updatedData.car_year = year;
        if (date !== originalReview.date) updatedData.purchase_date = date;

        let url;
        let method;

        if (reviewid) {
            // If reviewId exists, it's an edit, so use PUT
            if (Object.keys(updatedData).length === 0) {
                console.log("No changes detected, update skipped.");
                return; // Exit function if no changes
            }
            url = `${update_review_url}/${reviewid}`
            method = 'PUT';
        }
        else {
            url = review_url;
            method = 'POST';
            const name = currUser.firstname ? currUser.firstname + currUser.lastname : currUser.username
            const  username = currUser.username
            updatedData.name = name;
            updatedData.username = username;
            updatedData.dealership = id;
            updatedData.purchase = true;
        }

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            });
            if (!res.ok) throw new Error("Network response was not ok");
            if (res.status === 200) {
                navigate(`/dealer/${id}`);
                Toastify({
                    text: reviewid ? "Review Edited successfully!" : "Review Submitted successfully!",
                    duration: 10000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "linear-gradient(to right, #4CAF50, #43A047)",
                }).showToast();
            }
            else {
                alert("Issue updating Review. Please check your connection");
            }
        } catch (error) {
            console.error("There was an error:", error);
            alert("An error occurred while updating review. Please try again.");
        }
    }
    const get_dealer = async () => {
        const retobj = await fetchData(dealer_url);
        if (retobj && retobj.status === 200) {
            let dealerobjs = Array.from(retobj.dealer);
            if (dealerobjs.length > 0) setDealer(dealerobjs[0]);
        }
    }

    const get_cars = async () => {
        try {
            const retobj = await fetchData(carmodels_url);
            if (retobj && retobj.CarModels) {
                let carmodelsarr = Array.from(retobj.CarModels)
                setCarmodels(carmodelsarr)
            }
            else {
                console.error("Failed to fetch car models");
            }
    
        } catch (err) {
            console.error("error getting car info", err)
        }
    }

    useEffect(() => {
        get_dealer();
        get_cars();
    }, []);

    const isFormValid = reviewData.model && reviewData.review && reviewData.year && reviewData.date;

    return (
        <div>
            <div style={{ margin: "5%" }}>
                <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>
                <textarea
                    id='review'
                    name="review"
                    aria-label="Review text"
                    placeholder="Write your review here..."
                    value={reviewData.review}
                    cols='50'
                    rows='7'
                    onChange={handleChange}
                />
                <div className='input_field'>
                    Purchase Date
                    <input type="date" value={reviewData.date} name="date" onChange={handleChange} />
                </div>                
                <div className='input_field'>
                    Car Make
                    <select
                        name="model"
                        id="cars"
                        value={reviewData.model}
                        onChange={handleChange}
                    >
                        <option value="" disabled hidden>Choose Car Make and Model</option>
                        {carmodels.map(carmodel => (
                            <option 
                                value={carmodel.CarMake + " " + carmodel.CarModel}
                                key={carmodel.CarMake + "-" + carmodel.CarModel}
                            >
                                {carmodel.CarMake} {carmodel.CarModel}
                            </option>
                        ))}
                    </select>
                </div >

                <div className='input_field'>
                    Car Year <input type="number" name="year" value={reviewData.year} onChange={handleChange} max={currentYear} min={2015} />
                </div>

                <div>
                    <button className='postreview' onClick={postreview} disabled={!isFormValid}>Post Review</button>
                </div>
            </div>
        </div>
    )
}
export default PostReview
