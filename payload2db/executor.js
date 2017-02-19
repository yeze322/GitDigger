var pgp = require('pg-promise')({
  promiseLib: require('bluebird')
})
var db = pgp(require('./config.json'))
var q = require('../messageQ')
var { SAVE } = require('../actions/types')

const getQuery = pgp.helpers.insert
const IGNORE_CONFLICT = ' ON CONFLICT DO NOTHING'
const onErr = (table) => (reason) => { console.log('[db]Failed at ', table, ' -> ', reason.detail) }

console.log('================================')
console.log('Register message listener ...')

q.process(SAVE.USER, function (job, done) {
  // console.log('[SAVE][USER]: ', job.data.id, job.data.login)
  var data = {
    id: job.data.id,
    payload: job.data
  }
  db.query(getQuery(data, ['id', 'payload'], 'users'))
    .catch(onErr('users'))
    .finally(done)
})

q.process(SAVE.REPO, function (job, done) {
  // console.log('[SAVE][REPO]: ', job.data.id, job.data.full_name)
  var data = {
    id: job.data.id,
    payload: job.data
  }
  db.query(getQuery(data, ['id', 'payload'], 'repos'))
    .catch(onErr('repos'))
    .finally(done)
})

q.process(SAVE.STARGAZER, function (job, done) {
  // console.log('[SAVE][STARGAZER]: ', job.data.repoid, 'count = ', job.data.userlist.length)
  var data = {
    repoid: job.data.repoid,
    userlist: job.data.userlist
  }
  db.query(getQuery(data, ['repoid', 'userlist'], 'stargazers'))
    .catch(onErr('stargazers'))
    .finally(done)
})

q.process(SAVE.STARRING, function (job, done) {
  // console.log('[SAVE][STARRING]: ', job.data.userid, 'count = ', job.data.repolist.length)
  var data = {
    userid: job.data.userid,
    repolist: job.data.repolist
  }
  db.query(getQuery(data, ['userid', 'repolist'], 'starrings'))
    .catch(onErr('starrings'))
    .finally(done)
})

q.process(SAVE.BATCH_USERS, function (job, done) {
  var dataMulti = job.data.map(user => ({
    id: user.id,
    payload: user
  }))
  db.query(getQuery(dataMulti, ['id', 'payload'], 'users') + IGNORE_CONFLICT)
    .catch(onErr('users[batch]'))
    .finally(done)
})

q.process(SAVE.BATCH_REPOS, function (job, done) {
  var dataMulti = job.data.map(repo => ({
    id: repo.id,
    payload: repo
  }))
  db.query(getQuery(dataMulti, ['id', 'payload'], 'repos') + IGNORE_CONFLICT)
    .catch(onErr('repos[batch]'))
    .finally(done)
})

console.log(`Your service is runnning at ${process.pid} ...`)
console.log('================================')

function cleanUp () {
  console.log('Stop psql client ...')
  pgp.end()
  console.log('Stop kue connection ...')
  q.shutdown(3000, function (err) {
    console.log('Kue Shutdown: ', err || '')
    process.exit(0)
  })
}

process.on('SIGINT', cleanUp)
process.on('SIGTERM', cleanUp)
