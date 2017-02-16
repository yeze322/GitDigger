var DBClient = require('./MyClient')
var q = require('../messageQ')
var { SAVE } = require('../actions/types')

console.log('================================')
console.log('Starting PostgresQL client ...')
var client = new DBClient()
client.start()

console.log('Register message listener ...')
q.process(SAVE.REPO, function (job, done) {
  console.log('[SAVE][REPO]: ', job.data)
  client.saveRepo(job.data, () => {done()})
})
q.process(SAVE.STARGAZER, function (job, done) {
  console.log('[SAVE][STARGAZER]: ', job.data)
  client.saveStargazer(job.data, () => {done()})
})

q.process(SAVE.USER, function (job, done) {
  console.log('[SAVE][USER]: ', job.data)
  client.saveUser(job.data, () => {done()})
})

q.process(SAVE.STARRING, function (job, done) {
  console.log('[SAVE][STARRING]: ', job.data)
  client.saveStarring(job.data, () => {done()})
})

console.log(`Your service is runnning at ${process.pid} ...`)
console.log('================================')

function cleanUp () {
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
