const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceName: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  isOn: {
    type: Boolean,
    default: false
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
});

module.exports = mongoose.model('Device', deviceSchema);