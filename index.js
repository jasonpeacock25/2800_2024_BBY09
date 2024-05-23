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
const SMTPPool = require('nodemailer/lib/smtp-pool');
const { departingFlights, returnFlights, hotels } = require('./myBookings');

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


// Gurvir's Routes //////////////////
app.get('/hotels', sessionValidation, (req, res) => {
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

app.get('/availableHotels', sessionValidation, async (req, res) => {
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

app.get('/hotelSummary/:id', sessionValidation, async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    res.render('hotelSummary', { hotel, reviews: hotel.reviews });
});
// End of Gurvir's Routes //////////////////////////////

// Sign up page route
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Sign in page route
app.get('/signin', (req, res) => {
    res.render('signin', { message: null });
});

app.get('/main', (req, res) => {
    if (!req.session.authenticated) {
        res.redirect('/signin');
        return;
    }
    res.render('main', { username: req.session.username });
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
                res.render("signin", { message: "Invalid Password" })
            }
        } else {
            res.render("signin", { message: "Invalid Email" })
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
app.get('/about', sessionValidation, (req, res) => {
    res.render('about');
});

// My bookings page route
app.get('/myBookings', sessionValidation, (req,res) => {
    res.render('myBookings', {departingFlights, returnFlights, hotels });
});

app.get('/faq', sessionValidation, (req, res) => {
    res.render('faq');
});

// Flights page route
app.get('/flights', sessionValidation, (req, res) => {
    res.render('flights');
});

// Departing flights page
app.get('/flights/departing', sessionValidation, (req, res) => {
    const { flightType, travellers, fromInput, toInput, departDate, returnDate } = req.session;
    res.render('departingFlights', { departingFlights, flightType, travellers, fromInput, toInput, departDate, returnDate });
});

// Returning flights page
app.get('/flights/returning', sessionValidation, (req, res) => {
    const { flightType, travellers, fromInput, toInput, departDate, returnDate } = req.session;
    res.render('returningFlights', { departingFlights, flightType, travellers, fromInput, toInput, departDate, returnDate });
});

// Search flights (temporary format to display post is functioning)
app.post('/flights/search', (req, res) => {
    const { flightType, travellers, fromInput, toInput, departDate, returnDate } = req.body;
    req.session.flightType = flightType;
    req.session.travellers = travellers;
    req.session.fromInput = fromInput;
    req.session.toInput = toInput;
    req.session.departDate = departDate;
    req.session.returnDate = returnDate;
    res.redirect('departing');
});

app.get('/payment', sessionValidation, (req, res) => {
    res.render('payment');
})

app.get('/contact', sessionValidation, (req, res) => {
    res.render('contact');
});

app.get('/contact/inquiry', sessionValidation, (req, res) => {
    res.render('inquiry');
});

// Define a schema for the inquiry collection
const inquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    description: { type: String, required: true }
});

// Create a model for the inquiry collection
const Inquiry = mongoose.model('Inquiry', inquirySchema);

// Handle form submission to save inquiry to MongoDB
app.post('/contact/inquiry', async (req, res) => {
    const { name, email, subject, description } = req.body;

    // Validate user input
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        subject: Joi.string().allow('', null), // Allow empty or null subject
        description: Joi.string().required()
    });

    const { error } = schema.validate({ name, email, subject, description });
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        // Create a new inquiry and save it to MongoDB
        const newInquiry = new Inquiry({ name, email, subject, description });
        await newInquiry.save();

        // Redirect or respond as needed
        res.redirect('/contact/inquiry-confirmation');
    } catch (error) {
        console.error('Error saving inquiry:', error);
        res.status(500).send('Error saving inquiry.');
    }
});

// Route handler for inquiry confirmation page
app.get('/contact/inquiry-confirmation', sessionValidation, (req, res) => {
    res.render('inquiry-confirmation');
});




// Route to render admin page
app.get('/admin', async (req, res) => {
    if (!req.session.authenticated) {
        return res.redirect('/signin'); // Redirect to login if user is not logged in
    }

    try {
        const loggedInUser = await User.findOne({ username: req.session.username });

        if (!loggedInUser || loggedInUser.user_type !== 'admin') { // Check if user_type is not admin
            return res.status(403).render('404'); // Set status code to 403 and render error page
        } else {
            // Fetch all inquiries
            const inquiries = await Inquiry.find();

            // Fetch all users
            const allUsers = await User.find({}, 'username user_type');

            // Render admin page with user and inquiries data
            res.render('admin', { inquiries: inquiries, users: allUsers, user: 'templates/user' });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users.'); // Send internal server error if there's an error
    }
});

// Route for account information table
app.get("/account", sessionValidation, (req, res) => {
    res.render('account', {
        username: req.session.username,
        email: req.session.email
    });
});

app.post('/update-profile', async (req, res) => {
    const { name, email } = req.body;

    // Validate user input
    const schema = Joi.object({
        name: Joi.string().max(20).required(),
        email: Joi.string().email().required(),
    });

    const { error } = schema.validate({ name, email });
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    // Find the user and update their information
    const updatedUser = await User.findOneAndUpdate({ email: req.session.email }, {
        username: name,
        email: email,
    }, { new: true });

    req.session.username = updatedUser.username;
    req.session.email = updatedUser.email;

    res.redirect('account');
});

// route for the change password page
app.get('/change-password', sessionValidation, (req, res) => {
    res.render('password', { message: null });
});

// This route handles the password reset
app.post('/reset-password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ email: req.session.email });
        if (user) {
            const match = await bcrypt.compare(currentPassword, user.password);
            if (match) {
                user.password = await bcrypt.hash(newPassword, saltRounds);
                await user.save();
                res.render('password', { message: "Password Successfully Changed" });
            } else {
                res.render('password', { message: "Invalid Current Password. Try Again" });
            }
        } else {
            res.render('password', { message: "User Not Found!" });
        }
    } catch (error) {
        console.log(error);
        res.render('password', { message: "An error occurred. Please try again." });
    }
});

// Submit review to database
app.post('/submit-review', async (req, res) => {
    const { title, details, rating, hotelId } = req.body;

    try {
        const hotel = await Hotel.findById(hotelId);

        const newReview = {
            title,
            details,
            rating: parseInt(rating, 10),
            date: new Date()
        };

        hotel.reviews.push(newReview);

        // Save the hotel with the new review
        await hotel.save();

        // Calculate the new average rating
        const ratings = hotel.reviews.map(review => review.rating);
        const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
        const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

        // Update the hotel rating
        hotel.rating = averageRating;
        await hotel.save();

        res.redirect(`hotelSummary/${hotelId}`);
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).send('Internal Server Error');
    }
});

// 404 page for any routes that are not defined
// make sure this is the last route before app.listen
app.get("*", (req, res) => {
    res.status(404);
    res.render('404');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

