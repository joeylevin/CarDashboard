import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = ({ address }) => {
  const [location, setLocation] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // State to toggle map size

  const handleLoad = () => {
    console.log('loaded');
    setIsLoaded(true);
  };

  const toggleMapSize = () => {
    setIsExpanded(prevState => !prevState);
  };

  useEffect(() => {
    console.log('loaded', address, isLoaded)
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

  console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)

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
        </div>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
