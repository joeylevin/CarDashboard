const request = require('supertest');
const app = require('../app'); // Import your Express app
const Car = require('../inventory');

describe('Test Car Inventory API', () => {
    // Test GET /
    test('GET / should return Welcome message', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Welcome to the Car Inventory DB');
    });

    // Test GET /cars/:id
    test('GET /cars/:id should return cars by dealer ID', async () => {
        const dealerId = '1'; // Replace with a valid dealer_id for testing
        const response = await request(app).get(`/cars/${dealerId}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test GET /carsbymake/:id/:make
    test('GET /carsbymake/:id/:make should return cars by dealer ID and make', async () => {
        const dealerId = '8'; // Replace with a valid dealer_id
        const make = 'Kia'; // Replace with a valid car make
        const response = await request(app).get(`/carsbymake/${dealerId}/${make}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test GET /carsbymodel/:id/:model
    test('GET /carsbymodel/:id/:model should return cars by dealer ID and model', async () => {
        const dealerId = '15'; // Replace with a valid dealer_id
        const model = 'A4'; // Replace with a valid car model
        const response = await request(app).get(`/carsbymodel/${dealerId}/${model}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test GET /carsbymaxmileage/:id/:mileage
    test('GET /carsbymaxmileage/:id/:mileage should return cars by dealer ID and max mileage', async () => {
        const dealerId = '22'; // Replace with a valid dealer_id
        const mileage = 100000;
        const response = await request(app).get(`/carsbymaxmileage/${dealerId}/${mileage}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test GET /carsbyprice/:id/:price
    test('GET /carsbyprice/:id/:price should return cars by dealer ID and price range', async () => {
        const dealerId = '30'; // Replace with a valid dealer_id
        const price = 30000;
        const response = await request(app).get(`/carsbyprice/${dealerId}/${price}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test GET /carsbyyear/:id/:year
    test('GET /carsbyyear/:id/:year should return cars by dealer ID and minimum year', async () => {
        const dealerId = '2'; // Replace with a valid dealer_id
        const year = 2015;
        const response = await request(app).get(`/carsbyyear/${dealerId}/${year}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('Car Schema Validation', () => {
    test('should create a car with valid data', async () => {
        const car = new Car({
            dealer_id: 123,
            make: 'Toyota',
            model: 'Corolla',
            bodyType: 'Sedan',
            year: 2020,
            mileage: 30000,
            price: 20000,
        });

        const savedCar = await car.save();
        expect(savedCar._id).toBeDefined();
        expect(savedCar.make).toBe('Toyota');
        expect(savedCar.model).toBe('Corolla');
    });

    test('should fail to create a car without required fields', async () => {
        const car = new Car({
            make: 'Toyota',
            model: 'Corolla',
            bodyType: 'Sedan',
        });

        let err;
        try {
            await car.validate();
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err.errors.dealer_id).toBeDefined();
        expect(err.errors.year).toBeDefined();
        expect(err.errors.mileage).toBeDefined();
        expect(err.errors.price).toBeDefined();
    });

    test('should enforce minimum values on year, mileage, and price', async () => {
        const car = new Car({
            dealer_id: 123,
            make: 'Toyota',
            model: 'Corolla',
            bodyType: 'Sedan',
            year: 1800, // Invalid year
            mileage: -10, // Invalid mileage
            price: -5000, // Invalid price
        });

        let err;
        try {
            await car.validate();
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err.errors.year).toBeDefined();
        expect(err.errors.mileage).toBeDefined();
        expect(err.errors.price).toBeDefined();
    });

    test('should enforce type constraints on fields', async () => {
        const car = new Car({
            dealer_id: 'abc', // Should be a number
            make: 12345, // Should be a string
            model: true, // Should be a string
            bodyType: {}, // Should be a string
            year: 'year', // Should be a number
            mileage: 'miles', // Should be a number
            price: 'cost', // Should be a number
        });

        let err;
        try {
            await car.validate();
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err.errors.dealer_id).toBeDefined();
        // expect(err.errors.make).toBeDefined();
        // expect(err.errors.model).toBeDefined();
        expect(err.errors.bodyType).toBeDefined();
        expect(err.errors.year).toBeDefined();
        expect(err.errors.mileage).toBeDefined();
        expect(err.errors.price).toBeDefined();
    });
});
