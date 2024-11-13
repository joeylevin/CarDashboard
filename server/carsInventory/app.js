/*jshint esversion: 8 */
// app.js
// This Express server connects to a MongoDB database and provides an API for querying car inventory.
// Endpoints include fetching cars by dealer ID, make, model, mileage, price, and year.

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

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
app.get('/', async (req, res) => {
  res.send('Welcome to the Car Inventory DB');
});

// Get cars by dealer ID
app.get('/cars/:id', async (req, res) => {
  try {
    const documents = await Cars.find({dealer_id: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by dealer ID' });
  }
});

// Get cars by dealer ID and make
app.get('/carsbymake/:id/:make', async (req, res) => {
  try {
    const documents = await Cars.find({dealer_id: req.params.id, make: req.params.make});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by dealer ID and make' });
  }
});

// Get cars by dealer ID and model
app.get('/carsbymodel/:id/:model', async (req, res) => {
  try {
    const documents = await Cars.find({ dealer_id: req.params.id, model: req.params.model });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by dealer ID and model' });
  }
});

// Get cars by dealer ID and max mileage range
app.get('/carsbymaxmileage/:id/:mileage', async (req, res) => {
  try {
    const mileage = parseInt(req.params.mileage)
    const documents = await Cars.find({ dealer_id: req.params.id, mileage: getMileageCondition(mileage) });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by dealer ID and max mileage' });
  }
});

// Get cars by dealer ID and price range
app.get('/carsbyprice/:id/:price', async (req, res) => {
    try {
        const price = parseInt(req.params.price)
        const documents = await Cars.find({ dealer_id: req.params.id, price: getPriceCondition(price) });
        res.json(documents);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching cars by dealer ID and price range' });
      }
});

// Get cars by dealer ID and minimum year
app.get('/carsbyyear/:id/:year', async (req, res) => {
  try {
    const documents = await Cars.find({ dealer_id: req.params.id, year : { $gte :req.params.year }});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by dealer ID and minimum year' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;