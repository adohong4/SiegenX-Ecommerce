'use strict'

const express = require('express');
const { route } = require('./profile');
const router = express.Router();

router.use('/v1/api', require('./profile'));
router.use('/v1/api', require('./cart'));
router.use('/v1/api', require('./order'));


module.exports = router;