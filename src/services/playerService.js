const Character = require('../models/Characters');

const getAllPlayersWithObjectsPopulated = async () => {
    return await Character.find()
      .populate('equipment.saddlebag')
      .populate('equipment.weapons')
      .populate('equipment.pouch.precious_stones');
  };
  

module.exports = { getAllPlayersWithObjectsPopulated };