var PClient = require('./MyClient')
var testData = require('../consumer/sample')

var client = new PClient()
client.start()

client.saveRepo(testData.repo)
client.saveUser(testData.user)
client.saveStarring(testData.starring)
client.saveStargazer(testData.stargazer)

client.stop()