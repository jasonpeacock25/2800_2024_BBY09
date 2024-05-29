const mongoose = require('mongoose');

const BookingInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    hotelName: {
        type: String,
        required: false
    },
    hotelRegion: {
        type: String,
        required: false
    },
    hotelPrice: {
        type: Number,
        required: false
    },
    hotelRating: {
        type: Number,
        required: false
    },
    departingFlightNumber: String,
    departingFlightPrice: Number,
    returningFlightNumber: String,
    returningFlightPrice: Number,
    travellers: Number
});

const BookingInfo = mongoose.model('BookingInfo', BookingInfoSchema);
module.exports = BookingInfo;