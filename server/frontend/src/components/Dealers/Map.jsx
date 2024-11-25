import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = ({ address }) => {
    const [location, setLocation] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // State to toggle map size
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [directionsMessage, setDirectionsMessage] = useState("");

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const toggleMapSize = () => {
        setIsExpanded(prevState => !prevState);
    };

    useEffect(() => {
        if (isLoaded) {
            // Initialize Directions Service and Renderer when map is loaded
            setDirectionsService(new window.google.maps.DirectionsService());
            setDirectionsRenderer(new window.google.maps.DirectionsRenderer());
        }
    }, [isLoaded]);

    const handleGetDirections = () => {
        if (navigator.geolocation && directionsService && directionsRenderer && location) {
            setDirectionsMessage(""); // Clear previous messages
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = new window.google.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude
                    );

                    // Define request for directions
                    const request = {
                        origin: userLocation, // Current location
                        destination: location, // Dealer location
                        travelMode: window.google.maps.TravelMode.DRIVING, // Change to WALKING, BICYCLING, etc., if needed
                    };

                    // Get directions and render on the map
                    directionsService.route(request, (result, status) => {
                        if (status === "OK") {
                            directionsRenderer.setDirections(result);
                            setDirectionsMessage("Directions successfully loaded.");
                        } else if (status === "ZERO_RESULTS") {
                            setDirectionsMessage("No routes found between your location and the destination.");
                        } else {
                            console.error("Directions request failed due to: " + status);
                            setDirectionsMessage("Unable to fetch directions at this time. Please try again later.");
                        }
                    });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setDirectionsMessage("Unable to access your location. Please ensure location services are enabled.");
                }
            );
        } else {
            setDirectionsMessage("Directions services are not available. Please try reloading the page.");
        }
    };

    useEffect(() => {
        if (isLoaded && address) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    setLocation(results[0].geometry.location);
                } else {
                    console.error('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
    }, [address, isLoaded]);

    //   if (!isLoaded) {
    //     return <div>Loading map...</div>;
    //   }

    return (
        <div>
            <LoadScript
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                onLoad={handleLoad}
            >
                <div>
                    <button onClick={toggleMapSize} style={{ margin: '10px' }}>
                        {isExpanded ? 'Shrink Map' : 'Expand Map'}
                    </button>
                    <GoogleMap
                        mapContainerStyle={{
                            width: isExpanded ? '100%' : '300px',  // Size depends on `isExpanded`
                            height: isExpanded ? '400px' : '200px', // Size depends on `isExpanded`
                            transition: 'all 0.3s ease', // Smooth transition when resizing
                        }}
                        center={location || { lat: 0, lng: 0 }}
                        zoom={15}
                    >
                        {location && <Marker position={location} />}
                    </GoogleMap>
                    {location && (
                        <button onClick={handleGetDirections} style={{ marginTop: '10px' }}>
                            Get Directions
                        </button>
                    )}
                    {directionsMessage && (
                        <div style={{ marginTop: '10px', color: 'red' }}>
                            {directionsMessage}
                        </div>
                    )}
                </div>
            </LoadScript>
        </div>
    );
};

export default MapComponent;
