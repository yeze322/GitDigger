var redis = require('redis')
var bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

var config = require('./redisconf.json')
var client = redis.createClient(config)

module.exports = client