'use strict'

const express = require('express');
const router = express.Router();


router.use('/v1/api', require('./product'));
router.use('/v1/api', require('./campaign'));



module.exports = router;