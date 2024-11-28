//  NewDealer.jsx
//  This component allows admins to createa new dealership.
//
//  Allows updating fields such as short name, full name, address, city, state, and zip code.
//  Sends a PUT request to update the dealership details in the database.
//  Includes basic error handling for network issues or invalid responses.
// Uses google placess to autocomplete the name

import React, { useState, useEffect } from 'react';
import GooglePlacesAutocomplete, { geocodeByPlaceId }  from "react-google-places-autocomplete";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import "./Dealers.css";
import "../assets/style.css";


const NewDealer = ({ onSave, dealer }) => {
    const [addressDetails, setAddressDetails] = useState({
        address: "",
        city: "",
        zipCode: "",
        lat: "",
        long: "",
    });
    const [originalData, setOriginalData] = useState({})
    // TODO: check before updating
    const [shortName, setShortName] = useState("");
    // TODO: add shortname using long name
    const [fullName, setFullName] = useState("");

    // Determine the appropriate endpoint based on the mode
    const baseApiUrl = `${window.location.origin}/djangoapp`;
    const dealer_url = dealer ? `${baseApiUrl}/edit_dealer/${dealer.id}` : `${baseApiUrl}/new_dealer`;

    const headerText = dealer ? "Edit Dealer" : "Add New Dealer";

    useEffect(() => {
        if (dealer) {
            setAddressDetails({
                address: dealer.address || "",
                city: dealer.city || "",
                zip: dealer.zip || "",
                state: dealer.state || "",
                lat: dealer.lat || "",
                long: dealer.long || "",
            });
            setOriginalData({
                address: dealer.address || "",
                city: dealer.city || "",
                zip: dealer.zip || "",
                state: dealer.state || "",
                lat: dealer.lat || "",
                long: dealer.long || "",
            });
            setFullName(dealer.full_name || "");
        }
    }, [dealer]);

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

        const method = dealer ? 'PUT' : 'POST'

        const res = await fetch(dealer_url, {
            method,
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
        Toastify({
            text: dealer ? "Dealer saved successfully" : "Dealer created successfully!",
            duration: 5000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #4CAF50, #43A047)",
        }).showToast();
        if (onSave) onSave(updatedData);

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
            <h2>{headerText}</h2>
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
                            value: { label: addressDetails.address, value: addressDetails.address }
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
                    onClick={() => {
                        if (onSave) onSave();
                    }}
                >
                    Cancel
                </button>
        </div>
    );
}
export default NewDealer