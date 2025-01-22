const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: String,
  occupation: String,
  description: String,
  stats: {
    strength: Number,
    dexterity: Number,
    stamina: Number
  },
  equipment: {
    saddlebag: [String],
    quiver: Number,
    weapons: [String],
    pouch: {
      coins: Number,
      gold: Number,
      precious_stones: [String]
    },
    miscellaneous: [String]
  }
});
module.exports = mongoose.model('Character', characterSchema);