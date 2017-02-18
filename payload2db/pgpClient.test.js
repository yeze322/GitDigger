var PClient = require('./pgpClient')
var testData = require('./sample')

var client = new PClient()

client.saveRepo(testData.repo)
client.saveUser(testData.user)
client.saveStarring(testData.starring)
client.saveStargazer(testData.stargazer)

client.end()