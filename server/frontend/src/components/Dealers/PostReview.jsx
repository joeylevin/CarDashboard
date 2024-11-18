//
//  PostReview.jsx
//  This component allows users to post a review for a dealership.
//  * 
//  Features:
//  - Fetches dealership details and car models from the backend.
//  - Allows users to input their review, car details, and purchase date.
//  - Validates input to ensure all required fields are filled.
//  - Sends a POST request to submit the review to the backend.
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';


const PostReview = () => {
    const [dealer, setDealer] = useState({});
    const [reviewData, setReviewData] = useState({
        review: "",
        model: "",
        year: "",
        date: "",
    });    
    const [carmodels, setCarmodels] = useState([]);
    const navigate = useNavigate();
    let params = useParams();
    let id = params.id;


    let curr_url = window.location.href;
    let root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
    let dealer_url = root_url + `djangoapp/dealer/${id}`;
    let review_url = root_url + `djangoapp/add_review`;
    let carmodels_url = root_url + `djangoapp/get_cars`;
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
        let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
        const { model, review, date, year } = reviewData;
        //If the first and second name are stores as null, use the username
        if (name.includes("null")) {
            name = sessionStorage.getItem("username");
        }

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

        let jsoninput = JSON.stringify({
            "name": name,
            "dealership": id,
            "review": review,
            "purchase": true,
            "purchase_date": date,
            "car_make": make_chosen,
            "car_model": model_chosen,
            "car_year": year,
        });

        const json = await fetchData(review_url, 'POST', jsoninput);

        if (json.status === 200) {
            navigate(`/dealer/${id}`);
            alert("Review submitted successfully!");
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
                    cols='50'
                    rows='7'
                    onChange={handleChange}
                />
                <div className='input_field'>
                    Purchase Date
                    <input type="date" name="date" onChange={handleChange} />
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
                    Car Year <input type="number" name="year" onChange={handleChange} max={currentYear} min={2015} />
                </div>

                <div>
                    <button className='postreview' onClick={postreview} disabled={!isFormValid}>Post Review</button>
                </div>
            </div>
        </div>
    )
}
export default PostReview
