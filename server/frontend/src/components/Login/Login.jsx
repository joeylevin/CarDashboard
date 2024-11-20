// Login.jsx
//
// This component renders a login modal for user authentication. It includes a form where users can enter
// their username and password to log in to the application. Upon submission, the component sends the
// credentials to the server and, if authenticated, saves user data to session storage and redirects
// to the homepage.
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import { UserContext } from '../../contexts/UserContext';

const Login = ({ onClose }) => {
    const [userName, setUserName] = useState("");
    const { login } = useContext(UserContext);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    let login_url = window.location.origin + "/djangoapp/login";

    const loginHelper = async (e) => {
        e.preventDefault();
        if (userName === "") {
            setErrorMessage("Please enter a username")
            return;
        }
        if (password === "") {
            setErrorMessage("Please enter a password")
            return;
        }
        setIsLoading(true);

        try {
            const res = await fetch(login_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "userName": userName,
                    "password": password
                }),
            });

            const json = await res.json();
            if (json.status != null && json.status === "Authenticated") {
                login(json.userName, json.user_type, json.dealer_id, json.firstName, json.lastName)
            
                navigate("/");
            }
            else {
                console.error("Error authenticating user");
                setErrorMessage("Invalid credentials. Please check your username and password.");
            }
        } catch (error) {
            console.error("Error log in", error);
            setErrorMessage("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <div onClick={onClose}>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className='modalContainer'
                >
                    <form className="login_panel" style={{}} onSubmit={loginHelper}>
                        <div>
                            <span className="input_field">Username </span>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                className="input_field"
                                onChange={(e) => setUserName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <span className="input_field">Password </span>
                            <input
                                name="psw"
                                type="password"
                                placeholder="Password"
                                className="input_field"
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <input
                                className="action_button"
                                type="submit"
                                value={isLoading ? "Logging in..." : "Login"}
                                disabled={isLoading}
                            />
                            <input
                                className="action_button"
                                type="button"
                                value="Cancel"
                                onClick={() => navigate("/")}
                            />
                        </div>
                        {errorMessage && <p className="error_message">{errorMessage}</p>}
                        <a className="loginlink" href="/register">Register Now</a>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
