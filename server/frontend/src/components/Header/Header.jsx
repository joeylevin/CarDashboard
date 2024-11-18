// Header.jsx
//
// This component renders a responsive header with navigation links and a login/logout button.
// User information is retrieved from session storage and displayed when logged in.
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import "../assets/style.css";
import "../assets/bootstrap.min.css";
import "./Header.css";

const Header = () => {
    const { currUser, logout } = useContext(UserContext);

    const logoutHelper = async (e) => {
        e.preventDefault();
        const logoutUrl = `${window.location.origin}/djangoapp/logout`;
        try {
            const res = await fetch(logoutUrl, {
                method: "GET",
            });
    
            const json = await res.json();
            if (json) {
                let username = currUser.username
                logout();
                alert(`Logged out: ${username}`)
                window.location.href = window.location.origin;
            }
            else {
                console.error("Logout failed: ", json.message || "Unknown error");
                alert("Could not log out. Please try again.");
            }
        } catch (err) {
            console.error("Logout error: ", err);
            alert("Network error during logout. Please try again.");
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light header-nav">
                <div className="container-fluid">
                    <h2 className="header-title">Dealerships</h2>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarText" 
                        aria-controls="navbarText" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link header-link"
                                    exact
                                    to="/"
                                    activeClassName="active"
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                        className="nav-link"
                                        to="/about"
                                        activeClassName="active"
                                    >
                                        About Us
                                    </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    to="/contact"
                                    activeClassName="active"
                                >
                                    Contact Us
                                </NavLink>
                            </li>
                        </ul>
                        <span className="navbar-text">
                            <div className="loginlink">
                                {currUser.username ? (
                                    <>
                                        <span className="homepage_links">{currUser.username}</span>
                                        <a className="homepage_links" onClick={logoutHelper} href="/">Logout</a>
                                    </>
                                ) : (
                                    <>
                                        <NavLink
                                            className="nav-link"
                                            to="/login"
                                            activeClassName="active"
                                        >
                                            Login
                                        </NavLink>
                                        <NavLink
                                            className="nav-link"
                                            to="/register"
                                            activeClassName="active"
                                        >
                                            Register
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </span>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header
