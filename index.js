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
app.use(express.static('.'));
app.use(express.urlencoded({ extended: true }));

// Simple route
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/contact/message', (req, res) => {
    res.render('message');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

