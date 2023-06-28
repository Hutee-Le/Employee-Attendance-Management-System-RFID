const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  employeeCode: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  rfid: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
  }
  ,
  status: {
    type: String,
    default: "",
  },
  date: {
    type: Date
  }
})

module.exports = mongoose.model('Employee', employeeSchema);