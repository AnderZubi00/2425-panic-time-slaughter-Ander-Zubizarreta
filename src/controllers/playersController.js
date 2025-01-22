const playerService = require('../services/playerService');

const getPlayers = async (req, res) => {
  try {
    const players = await playerService.getAllPlayersWithObjectsPopulated();
    res.status(200).json(players);
    console.log("Players: ");
    console.log(players);
     
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los jugadores.' });
  }
};

module.exports = { getPlayers };

