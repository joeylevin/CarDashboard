/*jshint esversion: 8 */
// app.js
// This Express server connects to a MongoDB database and provides an API for querying car inventory.
// Endpoints include fetching cars by dealer ID, make, model, mileage, price, and year.

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3050;

app.use(cors());
app.use(express.urlencoded({ extended: false }));

const carsData = JSON.parse(fs.readFileSync('car_records.json', 'utf8'));

async function connectDatabase() {
    if (!mongoose.connection.readyState) {
        try {
            await mongoose.connect('mongodb://mongo_db:27017/', { dbName: 'dealershipsDB' })
            console.log('MongoDB connected to Car Inventory');
            await initializeData();
        } catch (error) {
            console.error('MongoDB Car Inventory connection error:', error);
        }
    }
}

const Cars = require('./inventory');

// Initialize database with data from car_records.json (for development)
async function initializeData() {
    try {
        await Cars.deleteMany({});
        await Cars.insertMany(carsData.cars);
        console.log("Database initialized with sample data.");
    } catch (error) {
        console.error("Error initializing data:", error);
    }
}

// Rate limiting middleware
const getLimiter = rateLimit({
    windowMs: 30 * 1000, // 30 second window
    max: 30, // Limit each IP to 30 requests per windowMs
    message: { error: "Too many requests, please try again later" },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

async function startServer() {
    await connectDatabase(); // Wait until the database connection is established
};
startServer();

// Helper functions for mileage and price conditions
function getMileageCondition(mileage) {
    if (mileage <= 50000) return { $lte: mileage };
    else if (mileage <= 100000) return { $lte: mileage, $gt: 50000 };
    else if (mileage <= 150000) return { $lte: mileage, $gt: 100000 };
    else if (mileage <= 200000) return { $lte: mileage, $gt: 150000 };
    return { $gt: 200000 };
}

function getPriceCondition(price) {
    if (price <= 20000) return { $lte: price };
    else if (price <= 40000) return { $lte: price, $gt: 20000 };
    else if (price <= 60000) return { $lte: price, $gt: 40000 };
    else if (price <= 80000) return { $lte: price, $gt: 60000 };
    return { $gt: 80000 };
}

// Routes

// Basic route
app.get('/', getLimiter, async (req, res) => {
    res.send('Welcome to the Car Inventory DB');
});

// Get cars
app.get('/inventory/', getLimiter, async (req, res) => {
    try {
        const { make, model, year, mileageMin, mileageMax, priceMin, priceMax, page = 1, limit = 10 } = req.query;

        const filters = {};

        if (make) {
            filters.make = make;
        }
        if (model) {
            filters.model = model;
        }
        if (year) {
            filters.year = { $gte: parseInt(year) }; // Cars from this year or newer
        }
        if (mileageMin && mileageMax) {
            filters.mileage = { $gte: parseInt(mileageMin), $lte: parseInt(mileageMax) };
        }
        if (priceMin && priceMax) {
            filters.price = { $gte: parseInt(priceMin), $lte: parseInt(priceMax) };
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalCars = await Cars.countDocuments(filters);
        const cars = await Cars.find(filters).skip(skip).limit(parseInt(limit));
        res.json({
            status: 200,
            cars,
            totalCars,
            totalPages: Math.ceil(totalCars / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching all cars' });
    }
});

// Get the list of makes, with the corresponding models
app.get('/makes_models/', getLimiter, async (req, res) => {
    console.log('makes')
    try {
        const makesModels = await Cars.aggregate([
            {
                $group: {
                    _id: "$make",
                    models: { $addToSet: "$model" }
                }
            },
            {
                $project: {
                    _id: 0,          // Exclude _id from output
                    make: "$_id",    // Rename _id to make
                    models: 1        // Include models
                }
            }
        ]);
        console.log(makesModels)

        res.status(200).json(makesModels);
    } catch (error) {
        console.error("Error fetching makes and models:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get cars by dealer ID
app.get('/cars/:id', getLimiter, async (req, res) => {
    try {
        const documents = await Cars.find({ dealer_id: req.params.id });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cars by dealer ID' });
    }
});

// Get cars by dealer ID and make
app.get('/carsbymake/:id/:make', getLimiter, async (req, res) => {
    try {
        const documents = await Cars.find({ dealer_id: req.params.id, make: req.params.make });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cars by dealer ID and make' });
    }
});

// Get cars by dealer ID and model
app.get('/carsbymodel/:id/:model', getLimiter, async (req, res) => {
    try {
        const documents = await Cars.find({ dealer_id: req.params.id, model: req.params.model });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cars by dealer ID and model' });
    }
});

// Get cars by dealer ID and max mileage range
app.get('/carsbymaxmileage/:id/:mileage', getLimiter, async (req, res) => {
    try {
        const mileage = parseInt(req.params.mileage)
        const documents = await Cars.find({ dealer_id: req.params.id, mileage: getMileageCondition(mileage) });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cars by dealer ID and max mileage' });
    }
});

// Get cars by dealer ID and price range
app.get('/carsbyprice/:id/:price', getLimiter, async (req, res) => {
    try {
        const price = parseInt(req.params.price)
        const documents = await Cars.find({ dealer_id: req.params.id, price: getPriceCondition(price) });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cars by dealer ID and price range' });
    }
});

// Get cars by dealer ID and minimum year
app.get('/carsbyyear/:id/:year', getLimiter, async (req, res) => {
    try {
        const documents = await Cars.find({ dealer_id: req.params.id, year: { $gte: req.params.year } });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cars by dealer ID and minimum year' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// module.exports = app;