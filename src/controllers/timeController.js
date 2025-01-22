const timeService = require('../services/timeService');
const Character = require('../models/Characters');
const { morningCycle, middayCycle, afternoonCycle, performNightCycle, performDatabaseUpdate } = require('../../gameLogic');

const getTimeHistory = async (req, res) => {
    try {
        const time = await timeService.getAllTimeRecords();
        res.status(200).json(time);
        console.log("Time: ");
        console.log(time);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el historial de tiempo.' });
    }
};

const postTime = async (req, res) => {
    try {
        const characters = await Character.find().populate('equipment.saddlebag').populate('equipment.weapons');
        const foodItems = await require('../models/Saddlebag').find();

        // Mañana
        const morningResults = morningCycle(characters, foodItems);
      
        // Mediodía
        const middayResults = middayCycle({ kmTotal: 0 });
      
        // Tarde
        const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' });
        const afternoonResults = afternoonCycle(characters, currentDay);
      
        // Noche
        const nightResults = performNightCycle(characters);
  
        // Actualizar base de datos
        const timeRecord = { day_number: 1, km_traveled: middayResults.kmsTraveled, km_total: 0 };

        await performDatabaseUpdate(characters, timeRecord);

        console.log('Ciclo de juego completado:', {
            morningResults,
            middayResults,
            afternoonResults,
            nightResults
        });

        res.status(200).json({
            message: 'Ciclo de juego completado.',
            morningResults,
            middayResults,
            afternoonResults,
            nightResults
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al procesar el ciclo de juego.' });
    }
};



module.exports = { getTimeHistory, postTime };


