/*jshint esversion: 8 */
// review.js
// This file defines a Mongoose schema and model for storing customer reviews of car dealerships.
// Each review includes details about the reviewer, dealership, review content, purchase information, and the car purchased.
// The schema also includes unique identifiers and timestamps for record-keeping.

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true  
    },
    dealership: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true
    },
    purchase: {
        type: Boolean,
        required: true
    },
    purchase_date: {
        type: String,
        required: true
    },
    car_make: {
        type: String,
        required: true
    },
    car_model: {
        type: String,
        required: true
    },
    car_year: {
        type: Number,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('reviews', ReviewSchema);
