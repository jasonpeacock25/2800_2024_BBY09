const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
require('dotenv').config();
const Joi = require('joi');
const saltRounds = 12;
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const port = 8000;

// Import the Hotel model
const Hotel = require('./models/Hotel');

// MongoDB URI
const mongoUri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`;

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB COMP2800');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('.'));
app.use(express.urlencoded({ extended: true }));

// Simple route
app.get('/', (req, res) => {
    res.render('index');
});


// Gurvir's Routes
app.get('/hotels', (req, res) => {
    res.render('hotels');
});

app.post('/search', async (req, res) => {
    const region = req.body.region;
    const checkInDate = req.body.checkIn;
    const checkOutDate = req.body.checkOut;

    req.session.hotelCheckInDate = checkInDate;
    req.session.hotelCheckOutDate = checkOutDate;

    // const hotels = await Hotel.find();
    // res.render('availableHotels', { hotels }, region);

});

app.get('/availableHotels', async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.render('availableHotels', { hotels });
    } catch (err) {
        console.error('Error fetching hotels:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/hotelSelection', async (req, res) => {
    const hotelID = req.body.hotelId;
    res.redirect(`hotelSummary/${hotelID}`);
});

app.get('/hotelSummary/:id', async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    res.render('hotelSummary', { hotel });
});

app.get('/about', (req, res) => {
    res.render('about');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

