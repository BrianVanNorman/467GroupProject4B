const express = require('express');
const connectDB = require('./db');
const routes = require('./routes');

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
    res.send('Hello, World!');
});



app.use('/', routes);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

