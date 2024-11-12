/*jshint esversion: 8 */
// dealership.js
// This file defines a Mongoose schema and model for storing dealership information.
// Each document represents a car dealership with details such as location, address, and name.
// The schema facilitates efficient storage and retrieval of dealership data, which can be linked to other collections like car inventory.

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DealershipSchema = new Schema({
	id: {
    type: Number,
    required: true,
    unique: true
	},
	city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  lat: {
    type: String,
    required: true
  },
  long: {
    type: String,
    required: true
  },
  short_name: {
    type: String,
  },
  full_name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('dealerships', DealershipSchema);
