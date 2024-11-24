import React from 'react';
import "../assets/style.css";
import "../assets/bootstrap.min.css";

const Home = () => {
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card" style={{ width: '50%', marginTop: '50px', alignSelf: 'center' }}>
                    <img src="static/car_dealership.jpg" className="card-img-top" alt="..." />
                    <div className="banner">
                        <h5>Welcome to our Dealerships!</h5>
                        <a href="/dealers" className="btn" style={{ backgroundColor: 'plum', margin: '10px' }}>View Dealerships</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home
