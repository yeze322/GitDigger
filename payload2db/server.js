var DBClient = require('./MyClient')
var q = require('../messageQ/q')
var {
  USER,
  REPO,
  STARGAZER,
  STARRING
} = require('../messageQ/types')

console.log('================================')
console.log('Starting PostgresQL client ...')
var client = new DBClient()
client.start()

console.log('Register message listener ...')
q.process(REPO, function (job, done) {
  client.saveRepo(job.data, () => {done()})
})
q.process(STARGAZER, function (job, done) {
  client.saveStargazer(job.data, () => {done()})
})

q.process(USER, function (job, done) {
  client.saveUser(job.data, () => {done()})
})

q.process(STARRING, function (job, done) {
  client.saveStarring(job.data, () => {done()})
})

console.log(`Your service is runnning at ${process.pid} ...`)
console.log('================================')

function cleanUp () {
  var fs = require('fs')
  fs.writeFile('./temp.txt', 'heloo')
  console.log('Stop psql client ...')
  client.stop()
  console.log('Stop kue connection ...')
  q.shutdown(3000, function (err) {
    console.log('Kue Shutdown: ', err || '')
    process.exit(0)
  })
}

process.on('SIGINT', cleanUp)
process.on('SIGTERM', cleanUp)
