import React, { useEffect, useState } from 'react';
import "../assets/style.css";
import "../assets/bootstrap.min.css";

const Header = () => {
  const [currUser, setCurrUser] = useState(null);

  const logout = async (e) => {
    e.preventDefault();
    const logoutUrl = `${window.location.origin}/djangoapp/logout`;
    const res = await fetch(logoutUrl, {
      method: "GET",
    });
  
    const json = await res.json();
    if (json) {
      let username = sessionStorage.getItem('username');
      sessionStorage.removeItem('username');
      window.location.href = window.location.origin;
      alert("Logging out "+username+"...")
    }
    else {
      alert("The user could not be logged out.")
    }
  };

  useEffect(() => {
    const user = sessionStorage.getItem('username');
    setCurrUser(user ? user : null);
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor:"darkturquoise",height:"1in"}}>
        <div className="container-fluid">
          <h2 style={{paddingRight: "5%"}}>Dealerships</h2>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" style={{fontSize: "larger"}} aria-current="page" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{fontSize: "larger"}} href="/about">About Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{fontSize: "larger"}} href="/contact">Contact Us</a>
              </li>
            </ul>
            <span className="navbar-text">
              <div className="loginlink">
                {currUser ? (
                  <>
                    <span className="homepage_links">{currUser}</span>
                    <a className="homepage_links" onClick={logout} href="/">Logout</a>
                  </>
                ) : (
                  <>
                    <a className="homepage_links" href="/login">Login</a>
                    <a className="homepage_links" href="/register">Register</a>
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
