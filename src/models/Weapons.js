const mongoose = require('mongoose');

const weaponSchema = new mongoose.Schema({
    name: String,
    description: String,
    num_die_damage: Number,
    type: String,
    quality: Number
  });
  
  module.exports = mongoose.model('Weapon', weaponSchema);