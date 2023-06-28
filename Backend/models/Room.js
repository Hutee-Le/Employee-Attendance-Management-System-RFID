const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  devices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
  }],

  customers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }]
});

module.exports = mongoose.model('Room', roomSchema);