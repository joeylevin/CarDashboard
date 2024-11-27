//  EditDealer.jsx
//  This component allows admins to edit the details of a specific dealership.
//
//  Fetches dealership data from the backend and pre-populates the form.
//  Allows updating fields such as short name, full name, address, city, state, and zip code.
//  Tracks changes and only submits modified fields to the backend.
//  Sends a POST request to update the dealership details in the database.
//  Redirects back to the dealership's page upon successful update.
//  Includes basic error handling for network issues or invalid responses.

import React, { useState } from 'react';
import GooglePlacesAutocomplete, { geocodeByPlaceId }  from "react-google-places-autocomplete";
import "./Dealers.css";
import "../assets/style.css";


const NewDealer = ({ onSave }) => {
    const [addressDetails, setAddressDetails] = useState({
        address: "",
        city: "",
        zipCode: "",
        lat: "",
        long: "",
    });
    const [shortName, setShortName] = useState("");
    const [fullName, setFullName] = useState("");


    let curr_url = window.location.href;
    let root_url = curr_url.substring(0, curr_url.indexOf("editdealer"));
    let dealer_url = root_url + `djangoapp/new_dealer`

    const submitDealer = async (e) => {
        e.preventDefault()
        const updatedData = {
            ...addressDetails,
            short_name: fullName,
            full_name: fullName,
          };

        if (!fullName || !addressDetails || !addressDetails.address || !addressDetails.zip || !addressDetails.city) {
            alert("Please provide all required information.");
            return;
        }

        const res = await fetch(dealer_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });

        if (!res.ok) {
            console.error("Failed to update dealer:", res.statusText);
            alert("An error occurred while saving changes. Please try again.");
            return;
        }
        const result = await res.json();
        alert('Dealer saved successfully!');
        if (onSave) onSave(result);

    }

    const getType = (locationData, type) => {
        for (const component of locationData) {
            if (component.types.includes(type)) {
              return component.long_name || '';
            }
          }
        return '';
    }

    const extractAddressComponents = async (place) => {
        try {
            const placeInfo = await geocodeByPlaceId(place.value.place_id)
            const components = placeInfo[0].address_components
            const geo = placeInfo[0].geometry.location
            const extractedAddress = {
                address: `${getType(components, "street_number")} ${getType(components, "route")}`,
                city: getType(components, "locality"),
                zip: getType(components, "postal_code"),
                state: getType(components, "administrative_area_level_1"),
                lat: geo.lat(),
                long: geo.lng(),
            };

            setAddressDetails(extractedAddress);
        } catch (err) {
            console.log('error geocode', err)
        }
    };

    return (
        <div style={{ margin: "5%" }}>
            <h2>Add a New Dealer</h2>
                <div className="input_field">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter full name"
                        required
                    />
                </div>
                <div className="input_field">
                    <label htmlFor="address">Address</label>
                    <GooglePlacesAutocomplete
                        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                        selectProps={{
                            onChange: (place) => extractAddressComponents(place),
                            placeholder: "Search address...",
                        }}
                    />
                </div>
                <div className='input_field'>
                    City:
                    <input
                        type="text"
                        value={addressDetails.city}
                        onChange={(e) => setAddressDetails({ ...addressDetails, city: e.target.value })}
                    />
                </div>
                <div className='input_field'>
                    State: 
                    <input 
                        type="text" 
                        value={addressDetails.state} 
                        onChange={(e) => setAddressDetails({ ...addressDetails, state: e.target.value })}
                    />
                </div>
                <div className='input_field'>
                    Zip Code: 
                    <input 
                        type="text" 
                        value={addressDetails.zip} 
                        onChange={(e) => setAddressDetails({ ...addressDetails, zip: e.target.value })}
                    />
                </div>
                <button 
                    type="submit"
                    className="postreview"
                    onClick={submitDealer}
                >
                    Save Dealer
                </button>
                <button
                    type="button"
                    className="postreview"
                    onClick={() => alert("Canceled")}
                >
                    Cancel
                </button>
        </div>
    );
}
export default NewDealer