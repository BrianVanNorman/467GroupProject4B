const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./db');
const routes = require('./controllers/routes');

const app = express();
const port = process.env.PORT || 3001;

async function startServer() {
  try {
    // Await the database connection before setting up the server
    await connectDB();

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
    app.use('/api', routes);

    // Catchall handler for any request that does not match one above, send back React's index.html file
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client/build/index.html'));
    });

    // General error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });

    // Start the server after all middleware and routes are defined
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

startServer();