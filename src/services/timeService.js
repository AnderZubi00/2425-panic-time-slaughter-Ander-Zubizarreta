const Time = require('../models/Time');

const getAllTimeRecords = async () => {
  return await Time.find();
};

const createTimeRecord = async (timeData) => {
  const timeRecord = new Time(timeData);
  return await timeRecord.save();
};

module.exports = { getAllTimeRecords, createTimeRecord };