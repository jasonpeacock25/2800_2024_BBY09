const mongoose = require('mongoose');

const BookingInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    region: {
        type: String,
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    }
});

const BookingInfo = mongoose.model('BookingInfo', BookingInfoSchema);
module.exports = BookingInfo;