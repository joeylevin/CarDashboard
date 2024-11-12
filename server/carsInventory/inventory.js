// inventory.js
// This file defines the Mongoose schema for the 'cars' collection in MongoDB.
// Each car document includes details such as dealer ID, make, model, body type, year, mileage, and price.

const mongoose = require('mongoose');

const { Schema } = mongoose;

const CarSchema = new Schema({
    dealer_id: {
        type: Number,
        required: true,
        index: true
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    bodyType: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        min: 1886
    },
    mileage: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

module.exports = mongoose.model('cars', CarSchema);