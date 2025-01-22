const express = require('express');
const { getTimeHistory, postTime } = require('../controllers/timeController');
const router = express.Router();

router.get('/', getTimeHistory);
router.post('/', postTime);

module.exports = router;