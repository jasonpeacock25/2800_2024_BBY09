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

//
const { OpenAI } = require('openai');
const openai = new OpenAI({ key: process.env.OPENAI_API_KEY });
//


const port = 8000;

// Import the Hotel model
const Hotel = require('./models/Hotel');
const BookingInfo = require('./models/BookingInfo');
const Flight = require('./models/Flight');

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

// Middleware to check if hotel data exists
function checkHotelData(req, res, next) {
    if (!req.session.hotel && !req.hotel) {
        return res.status(404).render('404', { message: 'Hotel not found' });
    }
    next();
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
    username: { type: String, required: true, maxlength: 20, trim: true },
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
app.use(express.json());
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

    req.session.region = region;
    req.session.hotelCheckInDate = checkInDate;
    req.session.hotelCheckOutDate = checkOutDate;

    // await User.findByIdAndUpdate(req.session.userId, {
    //     $push: {
    //         searchHistory: {
    //             region,
    //             checkInDate: new Date(checkInDate),
    //             checkOutDate: new Date(checkOutDate)
    //         }
    //     }
    // })

    res.redirect('availableHotels');
});

app.get('/availableHotels', sessionValidation, async (req, res) => {
    const { region, hotelCheckInDate, hotelCheckOutDate } = req.session;

    const hotels = await Hotel.find({
        region,
        startDate: { $lte: new Date(hotelCheckInDate) },
        endDate: { $gte: new Date(hotelCheckOutDate) }
    });

    res.render('availableHotels', { hotels });
});

app.post('/hotelSelection', async (req, res) => {
    const hotelID = req.body.hotelId;
    res.redirect(`hotelSummary/${hotelID}`);
});

// This route displays important information about the hotel plus a AI Reviw box
app.get('/hotelSummary/:id', sessionValidation, async (req, res) => {

    const checkInDate = new Date(req.session.hotelCheckInDate);
    const checkOutDate = new Date(req.session.hotelCheckOutDate);

    const amountOfDays = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    const hotel = await Hotel.findById(req.params.id);

    // Get the last 5 reviews
    const lastFiveReviews = hotel.reviews.slice(-5).map(review => review.details).join("\n\n");

    // Generate the summary using OpenAI API
    const aiResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "Summarize the following reviews." },
            { role: "user", content: lastFiveReviews }
        ]
    });
    const reviewSummary = aiResponse.choices[0].message.content;


    const formattedCheckInDate = checkInDate.toDateString();
    const formattedCheckOutDate = checkOutDate.toDateString();

    res.render('hotelSummary', { hotel, reviews: hotel.reviews, reviewSummary, amountOfDays, formattedCheckInDate, formattedCheckOutDate });
});

app.post('/bookHotel', sessionValidation, async (req, res) => {
    const checkInDate = new Date(req.session.hotelCheckInDate);
    const checkOutDate = new Date(req.session.hotelCheckOutDate);

    const formattedCheckInDate = checkInDate.toDateString();
    const formattedCheckOutDate = checkOutDate.toDateString();

    const amountOfDays = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    const hotel = await Hotel.findById(req.body.hotelId);
    res.render('payment', { hotel, amountOfDays });
});
// End of Gurvir's Routes //////////////////////////////

app.post('/confirmPayment', sessionValidation, async (req, res) => {
    const userId = req.session.userId;
    const { hotelId, hotelName, hotelRegion, hotelPrice, hotelRating } = req.body;

    const checkInDate = new Date(req.session.hotelCheckInDate);
    const checkOutDate = new Date(req.session.hotelCheckOutDate);

    const formattedCheckInDate = checkInDate.toDateString();
    const formattedCheckOutDate = checkOutDate.toDateString();

    const amountOfDays = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    try {
        const bookingInfo = new BookingInfo({
            userId,
            hotelName,
            hotelId,
            hotelRegion,
            hotelPrice,
            hotelRating
        });

        await bookingInfo.save();

        // Fetch all booking information for the user
        const hotel = await Hotel.findById(req.body.hotelId);

        res.render('orderConfirmation', { username: req.session.username, hotel, amountOfDays });
    } catch (error) {
        console.error('Error saving booking information', error)
        res.status(500).send('Internal Server Error');
    }
});

app.post('/confirmFlightPayment', sessionValidation, async (req, res) => {
    const userId = req.session.userId;
    let tempDepartingFlightNumber;
    let tempDepartingFlightPrice;
    let tempReturningFlightNumber;
    let tempReturningFlightPrice;
    const { departingFlight, returningFlight, travellers } = req.session;

    try {
        if (departingFlight) {
            const bookingInfo = new BookingInfo({
                userId: userId,
                departingOrReturning: "departing",
                number: departingFlight.number,
                departing: departingFlight.departing,
                arriving: departingFlight.arriving,
                departureDate: departingFlight.departureDate,
                departureTime: departingFlight.departureTime,
                arrivalDate: departingFlight.arrivalDate,
                arrivalTime: departingFlight.arrivalTime,
                type: departingFlight.type,
                provider: departingFlight.provider,
                model: departingFlight.model,
                emissions: departingFlight.emissions,
                price: departingFlight.price,
                travellers: travellers
            })
            tempDepartingFlightNumber = departingFlight.number;
            tempDepartingFlightPrice = departingFlight.price;
            await bookingInfo.save();
        };
    } catch (error) {
        console.error('Error saving booking information', error);
        res.status(500).send('Internal Server Error');
    }

    try {
        if (returningFlight) {
            const bookingInfo = new BookingInfo({
                userId: userId,
                departingOrReturning: "returning",
                number: returningFlight.number,
                departing: returningFlight.departing,
                arriving: returningFlight.arriving,
                departureDate: returningFlight.departureDate,
                departureTime: returningFlight.departureTime,
                arrivalDate: returningFlight.arrivalDate,
                arrivalTime: returningFlight.arrivalTime,
                type: returningFlight.type,
                provider: returningFlight.provider,
                model: returningFlight.model,
                emissions: returningFlight.emissions,
                price: returningFlight.price,
                travellers: travellers
            })
            tempReturningFlightNumber = returningFlight.number;
            tempReturningFlightPrice = returningFlight.price;
            await bookingInfo.save();
        };
    } catch (error) {
        console.error('Error saving booking information', error);
        res.status(500).send('Internal Server Error');
    }

    let returnNum

    res.render('flightOrderConfirmation', {
        username: req.session.username,
        departingFlight: {
            number: tempDepartingFlightNumber,
            price: tempDepartingFlightPrice,
            travellers: travellers
        },
        returningFlight: {
            number: tempReturningFlightNumber,
            price: tempReturningFlightPrice,
            travellers: travellers
        }
    });
});

// Sign up page route
app.get('/signup', (req, res) => {
    res.render('signup', { message: null });
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

    try {
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
    } catch (err) {
        console.error('Error saving user:', err);
        res.render('signup', { message: "Email Already Exists" });
    }
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
                req.session.userId = user._id;
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
app.get('/myBookings', sessionValidation, async (req, res) => {
    const userId = req.session.userId;
    try {
        // Fetch bookings for the user
        const bookings = await BookingInfo.find({ userId });

        const departingFlights = [];
        const returningFlights = [];
        const hotels = [];

        bookings.forEach(booking => {
            if (booking.departingOrReturning === "departing") {
                departingFlights.push({
                    userId: userId,
                    number: booking.number,
                    departing: booking.departing,
                    arriving: booking.arriving,
                    departureDate: booking.departureDate,
                    departureTime: booking.departureTime,
                    arrivalDate: booking.arrivalDate,
                    arrivalTime: booking.arrivalTime,
                    type: booking.type,
                    provider: booking.provider,
                    model: booking.model,
                    emissions: booking.emissions,
                    price: booking.price,
                    travellers: booking.travellers
                });
            }
            if (booking.departingOrReturning === "returning") {
                returningFlights.push({
                    userId: userId,
                    number: booking.number,
                    departing: booking.departing,
                    arriving: booking.arriving,
                    departureDate: booking.departureDate,
                    departureTime: booking.departureTime,
                    arrivalDate: booking.arrivalDate,
                    arrivalTime: booking.arrivalTime,
                    type: booking.type,
                    provider: booking.provider,
                    model: booking.model,
                    emissions: booking.emissions,
                    price: booking.price,
                    travellers: booking.travellers
                });
            }
            if (booking.hotelName) {
                hotels.push({
                    hotelName: booking.hotelName,
                    hotelRating: booking.hotelRating,
                    hotelPrice: booking.hotelPrice,
                    hotelRegion: booking.hotelRegion
                });
            }
        });


        res.render('myBookings', { hotels, departingFlights, returningFlights });
    } catch (error) {
        console.error('Error fetching booking information:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/faq', sessionValidation, (req, res) => {
    res.render('faq');
});

// Flights page route
app.get('/flights', sessionValidation, (req, res) => {
    //createFlights();
    delete req.session.departingFlight;
    delete req.session.returningFlight;
    res.render('flights');
});

// Departing flights page
app.get('/flights/departing', sessionValidation, async (req, res) => {
    delete req.session.departingFlight;
    delete req.session.returningFlight;
    const { flightType, travellers, fromInput, toInput, departDate, returnDate } = req.session;
    let departDateDate = new Date(departDate);
    // console.log(departDateDate);
    let departDateDatePlus = addDays(departDateDate, 1);
    // console.log(departDateDatePlus);
    let validDepartingFlights = await Flight.find({ departureDate: { $lte: departDateDatePlus, $gte: departDateDate }, departing: fromInput, arriving: toInput });
    res.render('departingFlights', { validDepartingFlights, travellers });
});

// Returning flights page
app.get('/flights/returning', sessionValidation, async (req, res) => {
    const { flightType, travellers, fromInput, toInput, departDate, returnDate } = req.session;
    if (flightType == "One Way") {
        res.redirect('review');
    } else {
        let returnDateDate = new Date(returnDate);
        // console.log(departDateDate);
        let returnDateDatePlus = addDays(returnDateDate, 1);
        // console.log(departDateDatePlus);
        let validReturnFlights = await Flight.find({ arrivalDate: { $lte: returnDateDatePlus, $gte: returnDateDate }, departing: toInput, arriving: fromInput });
        res.render('returningFlights', { validReturnFlights, travellers });
    }
});

//https://stackoverflow.com/questions/563406/how-to-add-days-to-date
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomHour() {
    let hours = randomInteger(0, 23);
    let minutes = randomInteger(0, 3) * 15;
    hours = ("0" + hours).slice(-2);
    minutes = ("0" + minutes).slice(-2);
    let time = hours + ":" + minutes;
    return time;
}

async function createFlights() {
    let locations = ["Beijing", "Houston", "Paris", "Vancouver", "Moon", "Mars"];
    let locationCodes = ["BEJ", "HOU", "PAR", "VAN", "LUN", "MRS"];
    let locationBody = ["Earth", "Earth", "Earth", "Earth", "Moon", "Mars"]
    let providers = ["NASA", "Blue Origin", "SpaceX", "Virgin Galactic"];
    let modelsBodyToBody = [["Curiosity 4", "Gemini XVI", "Pioneer 16"], ["Shepherd 3", "Blue 7", "Goddard"], ["Dragon 5", "Falcon 12", "Starship 2"], ["VSS Imagine", "VSS Enterprise", "VSS Voyager"]];
    let modelsSubOrbital = [["Space Shuttle 3", "Endeavour 2", "CST-250"], ["Starliner", "Turquoise 7", "Daintree 3"], ["Owl 2", "Komodo", "Scout 2"], ["VSS-S-1", "VSS-S-2", "VSS-B-1"]];
    let daysInEachMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    let flightArray = [];

    let tempInteger;
    let tempScale;
    let tempNumberCode = 0;
    let tempNumber;
    let tempDeparting;
    let tempArriving;
    let tempDepartureDate;
    let tempDepartureTime;
    let tempArrivalDate;
    let tempArrivalTime;
    let tempType;
    let tempProvider;
    let tempModel;
    let tempEmissions;
    let tempPrice;

    let tempFlight;

    for (let from = 0; from < locations.length; from++) {
        for (let to = 0; to < locations.length; to++) {
            for (let month = 0; month < daysInEachMonth.length; month++) {
                for (let day = 1; day <= daysInEachMonth[month]; day++) {
                    for (let y = 0; y < randomInteger(1, 4); y++) {
                        if (true) {
                            tempNumber = locationCodes[from] + "-" + locationCodes[to] + "-" + tempNumberCode;
                            tempNumberCode++;

                            tempDeparting = locations[from];
                            tempArriving = locations[to];

                            if (locationBody[from] == locationBody[to]) {
                                tempScale = 1;
                            } else if (locationBody[from] == "Mars" || locationBody[to] == "Mars") {
                                tempScale = 10;
                            } else {
                                tempScale = 3;
                            }

                            tempDepartureDate = new Date(2024, month, day);

                            tempDepartureTime = randomHour();

                            if (tempScale == 1) {
                                tempArrivalDate = addDays(tempDepartureDate, 1);
                            } else if (tempScale == 10) {
                                tempArrivalDate = addDays(tempDepartureDate, randomInteger(90, 140));
                            } else {
                                tempArrivalDate = addDays(tempDepartureDate, randomInteger(2, 3));
                            }

                            tempArrivalTime = randomHour();

                            tempInteger = randomInteger(0, 3)

                            tempProvider = providers[tempInteger];

                            if (locationBody[from] == locationBody[to]) {
                                tempType = "Sub-Orbital";
                                tempModel = modelsSubOrbital[tempInteger][randomInteger(0, 2)];
                            } else {
                                tempType = "Body to Body";
                                tempModel = modelsBodyToBody[tempInteger][randomInteger(0, 2)];
                            }

                            tempEmissions = randomInteger(5, 10) * tempScale;
                            tempPrice = randomInteger(750, 1900) * tempScale;

                            tempFlight = {
                                number: tempNumber,
                                departing: tempDeparting,
                                arriving: tempArriving,
                                departureDate: tempDepartureDate,
                                departureTime: tempDepartureTime,
                                arrivalDate: tempArrivalDate,
                                arrivalTime: tempArrivalTime,
                                type: tempType,
                                model: tempModel,
                                emissions: tempEmissions,
                                provider: tempProvider,
                                price: tempPrice
                            }

                            flightArray.push(tempFlight);
                        }
                    }
                }
            }
            tempNumberCode = 0;
            console.log("Completed " + locations[from] + " to " + locations[to]);
        }
    }

    await Flight.create(flightArray);
}

// Review flights page
app.get('/flights/review', sessionValidation, async (req, res) => {
    const { departingFlight, returningFlight, travellers } = req.session;
    if (!departingFlight) {
        res.redirect("/main")
    } else {
        res.render('reviewFlights', { departingFlight, returningFlight, travellers });
    }
});

app.post('/flights/clicked', (req, res) => {
    let type = req.body.type;
    let flight = req.body.flight;
    if (type == "departing") {
        req.session.departingFlight = flight;
        res.sendStatus(200);
    } else if (type == "returning") {
        req.session.returningFlight = flight;
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
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

app.get('/payment', sessionValidation, async (req, res) => {
    // const hotel = await Hotel.find();
    const hotel = await Hotel.findById(req.body.hotelId);
    res.render('payment', { hotel });
})

app.get('/flightPayment', sessionValidation, (req, res) => {
    const { departingFlight, returningFlight, travellers } = req.session;
    res.render('flightPayment', { departingFlight, returningFlight, travellers });
})

// Route to render contact page
app.get('/contact', sessionValidation, (req, res) => {
    res.render('contact');
});

//Route to render inquiry page
app.get('/contact/inquiry', sessionValidation, (req, res) => {
    res.render('inquiry');
});

app.get('/orderConfirmation', sessionValidation, checkHotelData, async (req, res) => {
    const userId = req.session.userId;

    try {
        // Fetch all booking information for the user
        const bookings = await BookingInfo.find({ userId }).sort({ createdAt: -1 }).exec;

        // Render orderConfirmation template with bookings
        res.render('orderConfirmation', {
            username: req.session.username,
            booking: bookings
        });
    } catch (error) {
        console.error('Error fetching booking information', error);
        res.status(500).send('Internal Server Error');
    }
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

// For terms and conditions page
app.get('/terms-and-conditions', (req, res) => {
    res.render('terms-and-conditions');
});

// For deleteing account 
/**
app.post('/delete-account', async (req, res) => {

    const user = await User.findById(req.session.userId);

    await user.deleteOne();

    res.redirect('/');
});  */


// 404 page for any routes that are not defined
// make sure this is the last route before app.listen
app.get("*", (req, res) => {
    res.status(404);
    res.render('404');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
});

