const mongoose = require('mongoose');

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

  imageURL: {
    type: String,
    required: true
  }
}, { collection: 'hotels' });

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
