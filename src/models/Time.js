const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
    day_number: Number,
    day_week: String,
    km_traveled: Number,
    km_total: Number
  });
  module.exports = mongoose.model('Time', timeSchema);
  