var config = require('../config.json')
var kue = require('kue')
var q = kue.createQueue(config.kue)

module.exports = q