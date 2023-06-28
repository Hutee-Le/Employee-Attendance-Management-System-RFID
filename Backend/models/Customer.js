const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    unique: true
  }, name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  checkIn: {
    type: Date,
    default: null
  },
  checkOut: {
    type: Date,
    default: null
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  }
})
module.exports = mongoose.model('Customer', CustomerSchema);