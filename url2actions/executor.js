var Q = require('../messageQ')
var pipes = require('../actions/pipes')
var redisClient = require('./redisClient')
var dispatch = require('../actions/dispatch').bind(this, Q)
var { SAVE, URL } = require('../actions/types')
var { UrlEvent, StargazerEdge, StargazingEdge } = require('../actions/schemas')

const MAX_HOP = 2
function fetchThenSave (from, to) {
  Q.process(from, function (job, done) {
    var urlEvent = job.data
    var request = pipes.url2request(urlEvent.url)
    request.then(data => {
      dispatch(to, data)
      done()
    })
  })
}

fetchThenSave(URL.REPO, SAVE.REPO)
fetchThenSave(URL.USER, SAVE.USER)

function checkDupUrl(url) {
  return redisClient
    .saddAsync('url', url)
    .then(success => {
      if (success === 0) {
        throw 'skip dup url'
      } else {
        return url
      }
    })
}

Q.process(URL.STARGAZER, function (job, done) {
  var urlEvent = job.data
  checkDupUrl(urlEvent.url)
    .then(url => pipes.url2request(url))
    // STEP 1 - Save entities to db
    .then(stargazers => {
      dispatch(SAVE.STARGAZER, new StargazerEdge(
        urlEvent.invoker.id,
        stargazers.map(x => x.id)
      ))
      dispatch(SAVE.BATCH_USERS, stargazers)
      return stargazers
    })
    // STEP 2 - trigger next requests under the limit of max HOP
    .then(stargazers => {
      if (urlEvent.hop > 0) {
        stargazers.forEach(user => {
          dispatch(URL.STARRING, new UrlEvent(
            pipes.user2starringUrl(user.login),
            user,
            urlEvent.hop - 1
          ))
        })
      }
    })
    .catch(err => {
      console.log(`Err at [${urlEvent.url}] - ${err}`)
    })
    .finally(done)
})

Q.process(URL.STARRING, function (job, done) {
  var urlEvent = job.data
  checkDupUrl(urlEvent.url)
    .then(url => pipes.url2request(url))
    // STEP 1 - Save entities to db
    .then(starrings => {
      dispatch(SAVE.STARRING, new StargazingEdge(
        urlEvent.invoker.id,
        starrings.map(x => x.id)
      ))
      dispatch(SAVE.BATCH_REPOS, starrings)
      return starrings
    })
    // STEP 2 - trigger next requests under the limit of max HOP
    .then(starrings => {
      if (urlEvent.hop > 0) {
        starrings.forEach(repo => {
          dispatch(URL.STARGAZER, new UrlEvent(
            pipes.repo2stargazerUrl(repo.full_name),
            repo,
            urlEvent.hop - 1
          ))
        })
      }
    })
    .catch(err => {
      // switch err.reason, ignore it or save to error list
      console.log(`Err at [${urlEvent.url}] - ${err}`)
    })
    .finally(done)
})

function cleanUp () {
  console.log('Stop redis client ...')
  redisClient.end()
  console.log('Stop kue connection ...')
  Q.shutdown(3000, function (err) {
    console.log('Kue Shutdown: ', err || '')
    process.exit(0)
  })
}

process.on('SIGINT', cleanUp)
process.on('SIGTERM', cleanUp)
