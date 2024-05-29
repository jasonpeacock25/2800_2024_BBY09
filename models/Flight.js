const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    number: {type: String, required: true},
    departing: {type: String, required: true},
    arriving: {type: String, required: true},
    departureDate: {type: Date, required: true},
    departureTime: {type: String, required: true},
    arrivalDate: {type: Date, required: true},
    arrivalTime: {type: String, required: true},
    type: {type: String, required: true},
    provider: {type: String, required: true},
    model: {type: String, required: true},
    emissions: {type: Number, required: true},
    price: {type: Number, required: true}
});

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;