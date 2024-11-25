export const displayDistance = (distance) => {
    if (distance !== null) {
        let displayVal;
        let unit;
        let distanceInKm = distance/1000;
        if (distanceInKm > 10000) {
            // Round to nearest 1000 km
            displayVal = Math.round(distanceInKm / 1000) * 1000
            unit = "km"
        } else if (distanceInKm > 1000) {
            // Round to nearest 500 km
            displayVal = Math.round(distanceInKm / 500) * 500
            unit = "km"
        } else if (distanceInKm > 100) {
            // Round to nearest 50 km
            displayVal = Math.round(distanceInKm / 50) * 50
            unit = "km"
        } else if (distanceInKm > 10) {
            // Round to 5
            displayVal = Math.round(distanceInKm / 5) * 5
            unit = "km"
        }
        else {
            // Less than 10 km, show in meters
            displayVal = Math.round(distance)
            unit = "m"
        }
        return `${displayVal.toLocaleString()} ${unit}`;
    }
}