// Register.jsx
// 
// This file contains the component for the user registration page. 
// It includes functionality for user input, form submission, and validation.
// - The component manages user details such as username, email, password, first name, last name, and user type (user, admin, or dealer).
// - If the user selects 'dealer' as their type, a dropdown of dealers is displayed to select from.
// - The form submission triggers an API call to register the user. 
// - On successful registration, the user is redirected to the home page and relevant session information is stored.
// - Errors are handled and alert messages are displayed for missing or invalid input.
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import validator from "validator";
import { DealerContext } from '../../contexts/DealerContext';
import "./Register.css";
import user_icon from "../assets/person.png"
import email_icon from "../assets/email.png"
import password_icon from "../assets/password.png"
import close_icon from "../assets/close.png"
import { UserContext } from "../../contexts/UserContext";

// Register component handles user registration for different user types.
const Register = () => {
    // Form input states
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userType, setUserType] = useState("user");
    const { dealers, loading, error } = useContext(DealerContext);
    const [dealer, setDealer] = useState(null); // Store selected dealer (if any)
    const [dealerList, setDealerList] = useState([]); // Store the list of dealers
    const [errorMessage, setErrorMessage] = useState(""); // Error message for validation or server errors
    const { login } = useContext(UserContext);


    const navigate = useNavigate();

    // Navigate to home
    const goHome = () => {
        navigate("/");
    }

    const userTypeHelper = async (input) => {
        if (input === "dealer") {
            const dealersOptions = dealers.map((dealer) => ({
                value: dealer.id,
                label: `${dealer.short_name} - ${dealer.state}`,
            }));
            setDealerList(dealersOptions)
            if (error) setErrorMessage("Error loading dealers. Please check your connection.");
        }
        else {
            if (error) setErrorMessage("");
        }
        setUserType(input)
    }

    // Handle form submission for registration
    const register = async (e) => {
        e.preventDefault();

        if (!userName || !password || !firstName || !lastName || !email) {
            setErrorMessage("All fields are required.");
            return;
        }

        if (!validator.isEmail(email)) {
            setErrorMessage("Invalid email format.");
            return;
        }
    
        if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            setErrorMessage("Password must be at least 8 characters long and include uppercase, lowercase, a number, and a symbol.");
            return;
        }

        if (userType === "dealer" && !dealer) {
            setErrorMessage("Please select a dealer if registering as a dealer.");
            return;
        }
        let register_url = window.location.origin + "/djangoapp/register";
        try {
            // Send registration data to backend
            const res = await fetch(register_url, {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({
                    userName,
                    password,
                    firstName,
                    lastName,
                    email,
                    user_type: userType,
                    dealer_id: dealer ? dealer.value : null,
                }),
            });

            const json = await res.json();
            // Handle successful registration
            if (json.status) {
                login(json.userName, json.user_type, json.dealer_id)
                goHome();
            }
            // Handle specific error for already registered username
            else if (json.error === "Already Registered") {
                setErrorMessage("A user with this username already exists. Please choose a different username.");
            } else {
                console.error("Error registering", json.error);
                setErrorMessage("An error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Error sending user info", error);
            setErrorMessage("An error occurred. Please check your connection.");
        }
    };

    return (
        <div className="register_container" style={{ width: "50%" }}>
            <div className="header">
                <span className="text" style={{ flexGrow: "1" }}>SignUp</span>
                <div className="close-btn-container">
                    <a href="/" onClick={() => { goHome() }} style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
                        <img style={{ width: "1cm" }} src={close_icon} alt="X" aria-label="Close"/>
                    </a>
                </div>
                <hr />
            </div>

            {/* Registration Form */}
            <form onSubmit={register}>
                <div className="inputs">
                    <div className="input">
                        <img src={user_icon} className="img_icon" alt='Username' />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="input_field"
                            aria-label="Username"
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    <div>
                        <img src={user_icon} className="img_icon" alt='First Name' />
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            className="input_field"
                            aria-label="First Name"
                            onChange={(e) => setFirstName(e.target.value)} />
                    </div>

                    <div>
                        <img src={user_icon} className="img_icon" alt='Last Name' />
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            className="input_field"
                            aria-label="Last Name"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="input">
                        <label htmlFor="userType">User Type</label>
                        <select
                            id="userType"
                            name="userType"
                            className="input_field"
                            value={userType}
                            onChange={(e) => userTypeHelper(e.target.value)}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="dealer">Dealer</option>
                        </select>
                    </div>
                    {/* Show dealer selection if user type is 'dealer' */}
                    {userType === "dealer" && (
                        <div className="input">
                            <label htmlFor="dealer">Select Dealer</label>
                            {loading ? (
                                <p>Loading dealers...</p>
                            ) : (
                                <Select
                                    options={dealerList}
                                    value={dealer}
                                    className="input_field"
                                    onChange={setDealer} // Set the selected dealer
                                    isSearchable={true}
                                    placeholder="Search dealers..."
                                    getOptionLabel={(e) => e.label}
                                />
                            )}
                        </div>
                    )}
                    <div>
                        <img src={email_icon} className="img_icon" alt='Email' />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="input_field"
                            aria-label="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input">
                        <img src={password_icon} className="img_icon" alt='password' />
                        <input
                            name="psw"
                            type="password"
                            placeholder="Password"
                            className="input_field"
                            aria-label="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                {errorMessage && <p className="error_message">{errorMessage}</p>}
                <div className="submit_panel">
                    <input className="submit" type="submit" value="Register" />
                </div>
            </form>
        </div>
    )
}

export default Register;