const mongoose = require('mongoose');

const preciousStoneSchema = new mongoose.Schema({
    name: String,
    description: String,
    value: Number
  });
  
  module.exports = mongoose.model('PreciousStone', preciousStoneSchema);