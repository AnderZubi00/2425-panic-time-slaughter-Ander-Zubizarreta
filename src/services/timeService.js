const Time = require('../models/Time');

const getAllTimeRecords = async () => {
  return await Time.find();
};

const createTimeRecord = async (timeData) => {
  const time = new Time(timeData);
  return await time.save();
};

module.exports = { getAllTimeRecords, createTimeRecord };