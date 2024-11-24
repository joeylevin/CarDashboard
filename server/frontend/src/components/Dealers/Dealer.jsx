// Dealer component that fetches and displays details for a specific dealer
// including their name, address, and reviews. It also allows for posting 
// new reviews and editing dealer information based on user permissions.
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDistance } from 'geolib';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png"
import neutral_icon from "../assets/neutral.png"
import negative_icon from "../assets/negative.png"
import review_icon from "../assets/reviewbutton.png"
import edit_icon from "../assets/edit.png"
import { UserContext } from '../../contexts/UserContext';
import { displayDistance } from '../../utils/helpers';

const Dealer = () => {
    const [dealer, setDealer] = useState({});
    const [reviews, setReviews] = useState([]);
    const [unreviewed, setUnreviewed] = useState(false);
    const [distance, setDistance] = useState(null);
    const { currUser, getUserLocation, location } = useContext(UserContext);
    const navigate = useNavigate();

    const curr_url = window.location.href;
    const root_url = curr_url.substring(0, curr_url.indexOf("dealer"));
    const { id } = useParams();
    const dealer_url = root_url + `djangoapp/dealer/${id}`;
    const reviews_url = root_url + `djangoapp/reviews/dealer/${id}`;
    const post_review = root_url + `postreview/${id}`;
    const post_dealer = root_url + `editdealer/${id}`;

    const get_dealer = async () => {
        try {
            const res = await fetch(dealer_url, {
                method: "GET"
            });
            const retobj = await res.json();

            if (retobj.status === 200) {
                let dealerobjs = Array.from(retobj.dealer)
                setDealer(dealerobjs[0]);
            }
        } catch (err) {
            console.error("Failed to fetch dealer:", err);
        }
    }

    const get_reviews = async () => {
        try {
            const res = await fetch(reviews_url, {
                method: "GET"
            });
            const retobj = await res.json();

            if (retobj.status === 200) {
                if (retobj.reviews.length > 0) {
                    setReviews(retobj.reviews)
                } else {
                    setUnreviewed(true);
                }
            }
        } catch (err) {
            console.error("Failed to get reviews:", err);
        }
    }

    const allowedEdit = ((currUser.user_type === "admin")
        || ((currUser.user_type === "dealer") && (currUser.dealer_id === id)));

    const senti_icon = (sentiment) => {
        let icon = sentiment === "positive" ? positive_icon : sentiment === "negative" ? negative_icon : neutral_icon;
        return <img src={icon} className="emotion_icon" alt="Sentiment" />;
    }

    useEffect(() => {
        get_dealer();
        get_reviews();
        getUserLocation();
    }, []);

    useEffect(() => {
        if (location && dealer.lat && dealer.long) {
            const distanceInMeters = getDistance(
                { latitude: location.latitude, longitude: location.longitude },
                { latitude: dealer.lat, longitude: dealer.long }
            );
            setDistance(distanceInMeters);  // Distance in meters
        }
    }, [location, dealer]);


    return (
        <div style={{ margin: "20px" }}>
            <div style={{ marginTop: "10px" }}>
                <h1 style={{ color: "grey" }}>{dealer.full_name} 
                    {allowedEdit ? (
                        <a href={post_dealer}>
                            <img src={edit_icon} style={{ width: '5%', marginLeft: '10px', marginTop: '10px' }} alt='Edit Dealer' />
                        </a>
                    ) : (
                        <></>
                    )}
                    {currUser.username ? (
                        <a href={post_review}>
                            <img src={review_icon} style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }} alt='Post Review' />
                        </a>
                    ) : (
                        <></>
                    )}
                </h1>
                <h4 style={{ color: "grey" }}>{dealer['city']}, {dealer['address']}, {dealer['zip']}, {dealer['state']} </h4>
                {displayDistance(distance)} away from you
            </div>
            <a href={`/searchcars/${id}`}>Search Cars</a>
            <div className="reviews_panel">
                {reviews.length === 0 && unreviewed === false ? (
                    <p>Loading Reviews....</p>
                ) : unreviewed === true ? (
                    <div>No reviews yet! </div>
                ) : (
                    reviews.map(review => (
                        <div className='review_panel' key={review.id}>
                            {senti_icon(review.sentiment)}
                            <div className='review'>{review.review}</div>
                            <div className="reviewer">{review.name} {review.car_make} {review.car_model} {review.car_year}</div>
                            {currUser.username === review.username && (
                                <button
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        // Pass review data to the PostReview page
                                        navigate(`/postreview/${id}/${review.id}`, { state: { reviewData: review } });
                                    }}
                                >
                                    <img 
                                        src={edit_icon} 
                                        alt="Edit Review" 
                                        style={{ width: "50%", marginLeft: "10px", marginTop: "10px" }} 
                                    />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Dealer
