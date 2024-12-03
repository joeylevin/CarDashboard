// RangeSlider.jsx
//
// This component displays a range selector with an upper and lower bound. 
import React, { useState, useEffect } from 'react';
import { Range, getTrackBackground } from 'react-range';
import './RangeSlider.css';

// RangeSlider component that accepts min, max, values, and other props
const RangeSlider = ({ values, onFinalChange, min, max, step, className, label, reset }) => {
    // Local state to track the current values of the slider
    const [sliderValues, setSliderValues] = useState(values);

    // Handle changes in the slider (on drag)
    const handleChange = (newValues) => {
        setSliderValues(newValues);
    };

    // Handle the final change when the user stops dragging (triggered by onFinalChange)
    const handleFinalChange = () => {
        onFinalChange(sliderValues);
    };

    // Reset the slider values when `reset` prop changes or when the initial `values` change
    useEffect(() => {
        if (reset) {
          setSliderValues(values);
        }
      }, [reset, values]); // Trigger when reset or initial values chang

    return (
        <div className="range-slider-container">
            {/* Display the label if provided */}
            {label && <label className="range-slider-label">{label}</label>}
            <Range
                step={step}        // Step size between values
                min={min}          // Minimum value for the slider
                max={max}          // Maximum value for the slider
                values={sliderValues} // Set the current values to the state
                // draggableTrack     // Allow dragging the track as well as the thumb
                onChange={handleChange} // Update values as user drags the slider
                onFinalChange={handleFinalChange} // Trigger final change on release
                className={className}   // Apply custom CSS class
                renderTrack={({ props, children }) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: "36px",
                            display: "flex",
                            width: "100%",
                        }}
                    >
                        <div
                        ref={props.ref}
                        style={{
                            height: "5px",
                            width: "100%",
                            borderRadius: "4px",
                            background: getTrackBackground({
                            values,
                            colors: ["#ccc", "#548BF4", "#ccc"],
                            min,
                            max,
                            }),
                            alignSelf: "center",
                        }}
                        >
                        {children}
                        </div>
                    </div>
                    )}
                    renderThumb={({ props, isDragged }) => (
                    <div
                        {...props}
                        key={props.key}
                        style={{
                            ...props.style,
                            height: "42px",
                            width: "42px",
                            borderRadius: "4px",
                            backgroundColor: "#FFF",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0px 2px 6px #AAA",
                        }}
                    >
                        <div
                        style={{
                            height: "16px",
                            width: "5px",
                            backgroundColor: isDragged ? "#548BF4" : "#CCC",
                        }}
                        />
                    </div>
                    )}
            />
            {/* Display the selected values on the UI */}
            <div className="slider-values">
                <span>{sliderValues[0]}</span> - <span>{sliderValues[1]}</span>
            </div>
        </div>
    );
};

export default RangeSlider;