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
        required: true,
        index: true 
    },
    model: {
        type: String,
        required: true,
        index: true 
    },
    bodyType: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        min: 1886,
        index: true 
    },
    mileage: {
        type: Number,
        required: true,
        min: 0,
        index: true 
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        index: true 
    }
});

CarSchema.index({ make: 1, model: 1, year: 1, mileage: 1, price: 1 });
CarSchema.index({ make: 1, model: 1, price: 1 });
CarSchema.index({ mileage: 1, year: 1 });


module.exports = mongoose.model('cars', CarSchema);