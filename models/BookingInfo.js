const mongoose = require('mongoose');

const BookingInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    hotelName: {
        type: String,
        required: true
    },
    hotelRegion: {
        type: String,
        required: true
    },
    hotelPrice: {
        type: Number,
        required: true
    },
    hotelRating: {
        type: Number,
        required: true
    }
});

const BookingInfo = mongoose.model('BookingInfo', BookingInfoSchema);
module.exports = BookingInfo;