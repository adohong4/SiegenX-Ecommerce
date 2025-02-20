'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const convertToObjectIdMongodb = id => Types.ObjectId(id)

const getInfoData = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds)
}

module.exports = {
    getInfoData, convertToObjectIdMongodb
}