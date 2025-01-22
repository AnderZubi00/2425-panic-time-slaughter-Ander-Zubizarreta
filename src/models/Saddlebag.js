const mongoose = require('mongoose');

const saddlebagSchema = new mongoose.Schema({
    name: String,
    description: String,
    recover_stamina: Number
  });
  
  module.exports = mongoose.model('Saddlebag', saddlebagSchema);