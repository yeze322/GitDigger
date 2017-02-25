var Q = require('../messageQ')
var pipes = require('../actions/pipes')
var pPipes = require('../actions/promisePipes')
var dispatch = require('../actions/dispatch').bind(this, Q)
var { SAVE, URL } = require('../actions/types')
var { UrlEvent, StargazerEdge, StargazingEdge } = require('../actions/schemas')

const MAX_HOP = 2
function fetchThenSave (from, to) {
  Q.process(from, function (job, done) {
    var urlEvent = job.data
    var request = pipes.url2request(urlEvent.url)
    request.then(data => {
      dispatch(to, data.body)
      done()
    })
  })
}

fetchThenSave(URL.REPO, SAVE.REPO)
fetchThenSave(URL.USER, SAVE.USER)

/**
 * @summary This listener is used to fetch stargazers of a repo.
 *          Then create new url jobs to fetch those stargazers' starred repos.
 */
Q.process(URL.STARGAZER, function (job, done) {
  var urlEvent = job.data
  pPipes.blockDupUrl(urlEvent.url)
    .then(url => pipes.url2request(url))
    .then(data => data.body)
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
            pipes.user2starringUrl(user),
            user,
            urlEvent.hop - 1
          ))
        })
      }
    })
    .catch(err => {
      console.log(`Err at [${urlEvent.url}] - ${err}`)
      if (err !== 'skip dup url') {
        return pPipes.handleFailedUrl(urlEvent.url)
      }
    })
    .finally(done)
})

/**
 * @summary This listener is used to fetch a user's starring repos.
 *          Then create next level repos' stargazers url to fetch users.
 * @description Fetching job is much more complicated here than in STARGAZER.
 *              1. As user entity doesn't contain it's starring repos count,
 *                 we need to iterate by reading response.headers.link.
 *              2. As repos contains it's stargazer count, so we need to generate
 *                 a list of stargazer url in different page. (repos may have many stargazers)
 */
Q.process(URL.STARRING, function (job, done) {
  var urlEvent = job.data
  pPipes.blockDupUrl(urlEvent.url)
    .then(url => pipes.url2request(url))
    // STEP 0 - trigger next page request (at the same level)
    .then(data => {
      let link = (data.headers || {})['link']
      let nextUrl = pipes.link2nextUrl(link)
      if (nextUrl) {
        dispatch(
          URL.STARRING, new UrlEvent(
            nextUrl, urlEvent.invoker, urlEvent.hop
          ))
      }
      return data.body
    })
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
          let nextUrlList = pipes.repo2stargazerUrlList(repo)
          // Since we can get repo's stargazer count,
          // so next urls can be calculated directly.
          // No step 0.
          nextUrlList.forEach(url => {
            dispatch(URL.STARGAZER, new UrlEvent(
              url, repo, urlEvent.hop - 1
            ))
          })
        })
      }
    })
    .catch(err => {
      // switch err.reason, ignore it or save to error list
      console.log(`Err at [${urlEvent.url}] - ${err}`)
      if (err !== 'skip dup url') {
        return pPipes.handleFailedUrl(urlEvent.url)
      }
    })
    .finally(done)
})

function cleanUp () {
  console.log('Stop kue connection ...')
  Q.shutdown(3000, function (err) {
    console.log('Kue Shutdown: ', err || '')
    process.exit(0)
  })
}

process.on('SIGINT', cleanUp)
process.on('SIGTERM', cleanUp)
