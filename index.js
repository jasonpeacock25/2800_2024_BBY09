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
const expireTime = 24 * 60 * 60 * 1000; //expires after 1 day  (hours * minutes * seconds * millis)

// Supporting function that checks if session is authenticated
function isValidSession(req) {
    if (req.session.authenticated) {
        return true;
    }
    return false;
}

// Middleware function that checks if session is validated and then passes request to the route handler
function sessionValidation(req, res, next) {
    if (isValidSession(req)) {
        next();
    }
    else {
        res.redirect('/signin');
    }
}

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

// Creating session collection
app.use(session({
    secret: process.env.NODE_SESSION_SECRET, // Secret key
    store: MongoStore.create({
        mongoUrl: mongoUri,
        collectionName: 'sessions'
    }),
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// The schema for user that the db will follow for the users collection
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, maxlength: 20, trim: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    user_type: { type: String, required: true, default: 'user' },
    searchHistory: [{
        region: String,
        checkInDate: Date,
        checkOutDate: Date
    }]
});

// Creating a user model
const User = mongoose.model('User', userSchema);

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/favicon_io', express.static('favicon_io'));
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

    await User.findByIdAndUpdate(req.session.userId, {
        $push: {
            searchHistory: {
                region,
                checkInDate: new Date(checkInDate),
                checkOutDate: new Date(checkOutDate)
            }
        }
    })

    res.redirect('availableHotels');
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
// End of Gurvir's Routes

// Sign up page route
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Sign in page route
app.get('/signin', (req, res) => {
    res.render('signin');
});

app.get('/main', (req, res) => {
    if (!req.session.authenticated) {
        res.redirect('/signin');
    }
    res.render('main');
});

// Submitting a user to the db creating a session
app.post('/submit-signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Validate user input
    const schema = Joi.object({
        name: Joi.string().max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const { error } = schema.validate({ name, email, password });
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user and save to MongoDB
    const newUser = new User({ username: name, email: email, password: hashedPassword, user_type: "user" });
    await newUser.save();

    // Session gets created here
    req.session.authenticated = true;
    req.session.username = newUser.username;
    req.session.email = email;
    req.session.user_type = newUser.user_type;
    req.session.cookie.maxAge = expireTime;
    req.session.userId = newUser._id;

    res.redirect('/main');
});

// Finding a user and creating a session for that user
app.post('/loggingin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                // Session gets created here
                req.session.authenticated = true;
                req.session.username = user.username;
                req.session.email = email;
                req.session.user_type = user.user_type;
                req.session.cookie.maxAge = expireTime;
                res.redirect('/main');
            } else {
                res.send("Invalid username or Password. Try Again");
            }
        } else {
            res.redirect("/signin");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/signin");
    }
});

// Logout page route that redirects to '/'. also destroys the current session
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// About us page route
app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/contact/message', (req, res) => {
    res.render('message');
});

// 404 page for any routes that are not defined
app.get("*", (req, res) => {
    res.status(404);
    res.render('404');
})

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

