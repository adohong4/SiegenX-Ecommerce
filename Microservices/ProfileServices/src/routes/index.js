'use strict'

const express = require('express');
const router = express.Router();

router.use('/v1/api', require('./profile'));
router.use('/v1/api', require('./cart'));
router.use('/v1/api', require('./order'));
router.use('/v1/api', require('./payment'));
router.use('/v1/api', require('./account'));


module.exports = router;