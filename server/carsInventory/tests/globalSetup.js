// globalSetup.js
const mongoose = require('mongoose');

async function connectWithRetry() {
    if (!mongoose.connection.readyState) {
    try {
      await mongoose.connect('mongodb://mongo_db:27017/testDB', {
        dbName: 'dealershipsDB',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection failed, retrying in 5 seconds...', error);
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    }
  }
}

module.exports = async () => {
    // Start server and connect to the database
    console.log('Running global setup...');
    await connectWithRetry();
};
