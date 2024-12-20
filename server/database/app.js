/*jshint esversion: 8 */
// app.js
// This file defines the main Express server, which handles the CRUD operations for the dealership and review data.
// The app connects to a MongoDB database, imports data from JSON files, and sets up several API routes to interact with the dealership and review collections.

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));
// Log all requests if needed
// app.use((req, res, next) => {
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//     console.log('Headers:', req.headers);
//     if (Object.keys(req.body).length) {
//         console.log('Body:', req.body);
//     }
//     next(); // Pass control to the next middleware or route handler
// });

// Rate limiting middleware
const editLimiter = rateLimit({
    windowMs: 30 * 1000, // 30 second window
    max: 15, // Limit each IP to 15 requests per windowMs
    message: { error: "Too many requests, please try again later" },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


// Rate limiting middleware
const getLimiter = rateLimit({
    windowMs: 30 * 1000, // 30 second window
    max: 30, // Limit each IP to 30 requests per windowMs
    message: { error: "Too many requests, please try again later" },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


// Load sample data from JSON files
try {
    reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
    dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));
} catch (error) {
    console.error("Error loading JSON files:", error);
    process.exit(1);  // Stop the server if the files are invalid or missing
}

async function connectDatabase() {
    if (!mongoose.connection.readyState) {
        try {
            await mongoose.connect("mongodb://mongo_db:27017/", { 'dbName': 'dealershipsDB' });
            console.log('MongoDB connected to Review and Dealership DB');
            await initializeData();
        } catch (error) {
            console.error('Review and Dealership Inventory connection error:', error);
        }
    }
}

const Reviews = require('./review');

const Dealerships = require('./dealership');

// Initialize database with data from json files (for development)
async function initializeData() {
    try {
        await Reviews.deleteMany({});
        await Reviews.insertMany(reviews_data.reviews);
        await Dealerships.deleteMany({});
        await Dealerships.insertMany(dealerships_data.dealerships);
        console.log("Database initialized with sample data.");
    } catch (error) {
        console.error("Error initializing data:", error);
    }
}

async function startServer() {
    await connectDatabase(); // Wait until the database connection is established
}
startServer();

// Routes
// Basic route to home
app.get('/', getLimiter, async (req, res) => {
    res.send("Welcome to the Mongoose API");
});

// Fetch all reviews
app.get('/fetchReviews', getLimiter, async (req, res) => {
    try {
        const documents = await Reviews.find();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Reviews' });
    }
});

// Fetch reviews for a particular dealership (by dealership ID)
app.get('/fetchReviews/dealer/:id', getLimiter, async (req, res) => {
    try {
        const documents = await Reviews.find({ dealership: req.params.id });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Reviews by dealer' });
    }
});

// Fetch review by it's id
app.get('/fetchReviews/:id', getLimiter, async (req, res) => {
    try {
        const documents = await Reviews.find({ id: req.params.id });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Reviews by dealer' });
    }
});

// Fetch all dealerships
app.get('/fetchDealers', getLimiter, async (req, res) => {
    try {
        const documents = await Dealerships.find();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Dealers' });
    }
});

// Fetch dealerships by state
app.get('/fetchDealers/:state', getLimiter, async (req, res) => {
    try {
        const documents = await Dealerships.find({ state: req.params.state });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealers by state' });
    }
});

// Fetch dealership by ID
app.get('/fetchDealer/:id', getLimiter, async (req, res) => {
    try {
        const documents = await Dealerships.find({ id: req.params.id });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealer by id' });
    }
});

// Update dealer by id
app.put('/update_dealer/:id', editLimiter, express.json(), async (req, res) => {
    try {
        const updatedDealer = await Dealerships.updateOne(
            { id: req.params.id },
            { $set: req.body }
        );

        if (!updatedDealer) {
            return res.status(404).json({ error: 'Dealer not found' });
        }
        res.json(updatedDealer);
    } catch (error) {
        console.error("Error updating dealer:", error);
        res.status(500).json({ error: 'Error updating dealer information' });
    }
});

// Update dealer by id
app.post('/new_dealer/', express.json(), editLimiter, async (req, res) => {
    try {
        const { full_name, address, city, zip, state, lat, long, short_name } = req.body;
        if (!full_name || !address || !city || !zip || !state || !lat || !long || !short_name) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const documents = await Dealerships.find().sort({ id: -1 });
        const new_id = documents.length > 0 ? documents[0].id + 1 : 1;

        const dealer = new Dealerships({
            id: new_id,
            full_name,
            address,
            city,
            zip,
            state,
            lat,
            long,
            short_name
        });
    
        try {
            const savedDealer = await dealer.save();
            res.json(savedDealer);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error creating dealer' });
        }
    } catch (error) {
        console.error("Error creating dealer:", error);
        res.status(500).json({ error: 'Error creating dealer' });
    }
});

// Insert a new review (via POST request)
app.post('/insert_review', express.raw({ type: '*/*' }), editLimiter, async (req, res) => {
    data = JSON.parse(req.body);
    const documents = await Reviews.find().sort({ id: -1 });
    const new_id = documents.length > 0 ? documents[0].id + 1 : 1;

    const review = new Reviews({
        "id": new_id,
        "name": data.name,
        "username": data.username,
        "dealership": data.dealership,
        "review": data.review,
        "purchase": data.purchase,
        "purchase_date": data.purchase_date,
        "car_make": data.car_make,
        "car_model": data.car_model,
        "car_year": data.car_year,
    });

    try {
        const savedReview = await review.save();
        res.json(savedReview);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error inserting review' });
    }
});

// Edit a review (via POST request)
app.put('/edit_review/:id', express.json(), editLimiter, async (req, res) => {
    try {
        const review = await Reviews.findOne({ id: req.params.id });

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (review.username !== req.body.username) {
            return res.status(403).json({ error: 'Forbidden: You do not have permission to edit this review' });
        }

        // // Define a validation schema
        // const schema = Joi.object({
        //     name: Joi.string().max(255),
        //     username: Joi.string().max(255),
        //     dealership: Joi.number(),
        //     review: Joi.string(),
        //     purchase: Joi.boolean(),
        //     rating: Joi.number().min(1).max(5),
        //     purchase_date: Joi.string(),
        //     car_make: Joi.string().max(255),
        //     car_model: Joi.string().max(255),
        //     car_year: Joi.number().max(5000)
        // });

        // // Validate req.body
        // const { error, value } = schema.validate(req.body);

        // if (error) {
        //     return res.status(400).json({ message: error.details[0].message });
        // }

        const updatedReview = await Reviews.updateOne(
            { id: req.params.id },
            { $set: req.body }
        );

        res.json(updatedReview);
    } catch (error) {
        console.error("Error updating Review:", error);
        res.status(500).json({ error: 'Error updating Review' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
