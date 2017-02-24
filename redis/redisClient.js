var redis = require('redis')
var bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

var config = require('../config.json')
var client = redis.createClient(config.redis)

module.exports = client