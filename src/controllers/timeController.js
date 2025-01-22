const timeService = require('../services/timeService');

const getTimeHistory = async (req, res) => {
  try {
    const timeRecords = await timeService.getAllTimeRecords();
    res.status(200).json(timeRecords);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el historial de tiempo.' });
  }
};

const postTime = async (req, res) => {
  try {
    const { day_number, day_week, km_traveled, km_total } = req.body;
    const newTime = await timeService.createTimeRecord({ day_number, day_week, km_traveled, km_total });
    res.status(201).json(newTime);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar el tiempo.' });
  }
};

module.exports = { getTimeHistory, postTime };

