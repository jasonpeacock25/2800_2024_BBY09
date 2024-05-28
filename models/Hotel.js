const mongoose = require('mongoose');

// Define the review schema
const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Define the hotel schema
const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true
  },
  reviews: [reviewSchema]
}, { collection: 'hotels' });

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
