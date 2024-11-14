import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';


const EditDealer = () => {
    const [dealer, setDealer] = useState({});
    const [originalDealer, setOriginalDealer] = useState({}); 
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [address, setAddress] = useState("");
    const [shortName, setShortName] = useState("");
    const [fullName, settFullName] = useState("");

    let curr_url = window.location.href;
    let root_url = curr_url.substring(0, curr_url.indexOf("editdealer"));
    let params = useParams();
    let id = params.id;
    let dealer_url = root_url + `djangoapp/dealer/${id}`;
    let review_url = root_url + `djangoapp/edit_dealer/${id}`;

    const saveChanges = async () => {
        let updatedData = {};

        // Only add fields to updatedData if they have changed
        if (zip !== originalDealer.zip) updatedData.zip = zip;
        if (city !== originalDealer.city) updatedData.city = city;
        if (state !== originalDealer.state) updatedData.state = state;
        if (address !== originalDealer.address) updatedData.address = address;
        if (shortName !== originalDealer.short_name) updatedData.short_name = shortName;
        if (fullName !== originalDealer.full_name) updatedData.full_name = fullName;

        if (Object.keys(updatedData).length === 0) {
            console.log("No changes detected, update skipped.");
            return; // Exit function if no changes
        }

        const res = await fetch(review_url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });

        if (res.status === 200) {
            window.location.href = window.location.origin + "/dealer/" + id;
        }
        else {
            const err = await res.json();
            console.error("Error:", err);
        }
    }
    const get_dealer = async () => {
        const res = await fetch(dealer_url, {
            method: "GET"
        });
        const retobj = await res.json();

        if (retobj.status === 200) {
            let dealerobjs = Array.from(retobj.dealer)
            if (dealerobjs.length > 0) {
                let dealerData = dealerobjs[0];
                setDealer(dealerData);
                setOriginalDealer(dealerData);
                setZip(dealerData.zip);
                setZip(dealerData.zip || "");
                setCity(dealerData.city || "");
                setState(dealerData.state || "");
                setAddress(dealerData.address || "");
                setShortName(dealerData.short_name || "");
                settFullName(dealerData.full_name || "");
            }
        }
    }

    useEffect(() => {
        get_dealer();
    }, []);


    return (
        <div>
            <Header />
            <div style={{ margin: "5%" }}>
                <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>
                <div className='input_field'>
                    Short Name: <input type="text" value={shortName} onChange={(e) => setShortName(e.target.value)} />
                </div>
                <div className='input_field'>
                    Full Name: <input type="text" value={fullName} onChange={(e) => settFullName(e.target.value)} />
                </div>
                <div className='input_field'>
                    Address: <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className='input_field'>
                    City: <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className='input_field'>
                    State: <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
                </div>
                <div className='input_field'>
                    Zip Code: <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} />
                </div>

                <div>
                    <button className='postreview' onClick={saveChanges}>Save Changes</button>
                </div>
            </div>
        </div>
    )
}
export default EditDealer