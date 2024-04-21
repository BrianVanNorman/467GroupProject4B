const express = require('express');
const path = require('path');
const cors = require('cors'); // You need to install cors with npm install cors
const connectDB = require('./db');
const connectLegacyDB = require('./legacyDB');
const routes = require('./controllers/routes');

const app = express();
const port = process.env.PORT || 3001; // Use environment variable for port if set

// Connect to MongoDB
connectDB();

connectLegacyDB();

// Middleware to parse JSON bodies
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// CORS middleware setup for development
app.use(cors());

// Serve the static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// Routes
app.use('/api', routes); // Prefixed all routes with /api to avoid conflicts

// Catchall handler for any request that does not match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});