const express = require('express');
const connectDB = require('./db');
const SalesAssociate = require('./models/SalesAssociate');

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Routes defined here
app.post('/sales-associates', async (req, res) => {
    try {
        const { id, name, email } = req.body;
        let associate = new SalesAssociate({ id, name, email });
        await associate.save();
        res.status(201).send(associate);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

app.get('/sales-associates', async (req, res) => {
    try {
        const associates = await SalesAssociate.find();
        res.status(200).send(associates);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
