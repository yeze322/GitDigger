var pgp = require('pg-promise')({
  promiseLib: require('bluebird')
})
var config = require('../config.json')
var db = pgp(config.psql)

module.exports = db
