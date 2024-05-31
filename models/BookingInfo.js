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
    departingOrReturning: { type: String, required: false },
    number: { type: String, required: false },
    departing: { type: String, required: false },
    arriving: { type: String, required: false },
    departureDate: { type: Date, required: false },
    departureTime: { type: String, required: false },
    arrivalDate: { type: Date, required: false },
    arrivalTime: { type: String, required: false },
    type: { type: String, required: false },
    provider: { type: String, required: false },
    model: { type: String, required: false },
    emissions: { type: Number, required: false },
    price: { type: Number, required: false },
    travellers: { type: Number, required: false }
});

const BookingInfo = mongoose.model('BookingInfo', BookingInfoSchema);
module.exports = BookingInfo;