var PClient = require('../psql/psqlClient')
var handlers = require('./eventHandlers')
var testData = require('./sample')

var client = new PClient()
client.start()

handlers.saveRepo.call(client, testData.repo)
handlers.saveUser.call(client, testData.user)
handlers.saveStargazer.call(client, testData.stargazer)
handlers.saveStarring.call(client, testData.starring)

client.stop()