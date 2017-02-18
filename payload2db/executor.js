var DBClient = require('./pgpClient')
var q = require('../messageQ')
var { SAVE } = require('../actions/types')

const onErr = (reason) => {
  console.log('[db]Failed: ', reason.detail)
}

console.log('================================')
console.log('Starting PostgresQL client ...')
var client = new DBClient()

console.log('Register message listener ...')
q.process(SAVE.REPO, function (job, done) {
  client.saveRepo(job.data).catch(onErr).finally(done)
})
q.process(SAVE.STARGAZER, function (job, done) {
  client.saveStargazer(job.data).catch(onErr).finally(done)
})

q.process(SAVE.USER, function (job, done) {
  client.saveUser(job.data).catch(onErr).finally(done)
})

q.process(SAVE.STARRING, function (job, done) {
  client.saveStarring(job.data).catch(onErr).finally(done)
})

q.process(SAVE.BATCH_USERS, function (job, done) {
  client.saveBatchUsers(job.data).catch(onErr).finally(done)
})

q.process(SAVE.BATCH_REPOS, function (job, done) {
  client.saveBatchRepos(job.data).catch(onErr).finally(done)
})

console.log(`Your service is runnning at ${process.pid} ...`)
console.log('================================')

function cleanUp () {
  console.log('Stop psql client ...')
  client.end()
  console.log('Stop kue connection ...')
  q.shutdown(3000, function (err) {
    console.log('Kue Shutdown: ', err || '')
    process.exit(0)
  })
}

process.on('SIGINT', cleanUp)
process.on('SIGTERM', cleanUp)
