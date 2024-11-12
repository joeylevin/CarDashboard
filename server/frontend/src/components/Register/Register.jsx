import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./Register.css";
import user_icon from "../assets/person.png"
import email_icon from "../assets/email.png"
import password_icon from "../assets/password.png"
import close_icon from "../assets/close.png"

const Register = () => {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("user");
  const [dealer, setDealer] = useState(null); // Store selected dealer
  const [dealerList, setDealerList] = useState([]); // Store the list of dealers

  const navigate = useNavigate();

  const dealer_url ="/djangoapp/get_dealers";

  const goHome = ()=> {
    navigate("/");
  }

  const get_dealers = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      let all_dealers = Array.from(retobj.dealers)
      const dealersOptions = all_dealers.map((dealer) => ({
        value: dealer.id,
        label: `${dealer.short_name} - ${dealer.state}`,
      }));
      setDealerList(dealersOptions)
    }
  }

  useEffect(() => {
    get_dealers();
  },[]);

  const register = async (e) => {
    e.preventDefault();

    if (!userName || !password || !firstName || !lastName || !email) {
      alert("Please fill in all fields");
      return;
    }

    let register_url = window.location.origin+"/djangoapp/register";
    try {
      const res = await fetch(register_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          password,
          firstName,
          lastName,
          email,
          userType,
          dealer: dealer ? dealer.value : null,
        }),
      });

      const json = await res.json();
      if (json.status) {
        sessionStorage.setItem('username', json.userName);
        goHome();
      }
      else if (json.error === "Already Registered") {
        alert("The user with same username is already registered");
        goHome();
      } else {
        alert("An error occurred. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please check your connection.");
    }
  };

  return(
    <div className="register_container" style={{width: "50%"}}>
      <div className="header">
          <span className="text" style={{flexGrow:"1"}}>SignUp</span> 
          <div className="close-btn-container">
          <a href="/" onClick={()=>{goHome()}} style={{justifyContent: "space-between", alignItems:"flex-end"}}>
            <img style={{width:"1cm"}} src={close_icon} alt="X"/>
          </a>
          </div>
          <hr/>
        </div>

        <form onSubmit={register}>
        <div className="inputs">
          <div className="input">
            <img src={user_icon} className="img_icon" alt='Username'/>
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
            <img src={user_icon} className="img_icon" alt='First Name'/>
            <input 
              type="text"  
              name="first_name" 
              placeholder="First Name" 
              className="input_field" 
              aria-label="First Name"
              onChange={(e) => setFirstName(e.target.value)}/>
          </div>

          <div>
            <img src={user_icon} className="img_icon" alt='Last Name'/>
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
              onChange={(e) => setUserType(e.target.value)}
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
              <Select
                options={dealerList}
                value={dealer}
                className="input_field"
                onChange={setDealer} // Set the selected dealer
                isSearchable={true}
                placeholder="Search dealers..."
                getOptionLabel={(e) => e.label}
              />
            </div>
          )}
          <div>
            <img src={email_icon} className="img_icon" alt='Email'/>
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
            <img src={password_icon} className="img_icon" alt='password'/>
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
        <div className="submit_panel">
          <input className="submit" type="submit" value="Register"/>
        </div>
      </form>
      </div>
  )
}

export default Register;