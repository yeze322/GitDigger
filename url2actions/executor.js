var Q = require('../messageQ')
var { SAVE, URL } = require('../actions/types')
var pipes = require('../actions/pipes')
var { UrlEvent, StargazerEdge, StargazingEdge } = require('../actions/schemas')
var dispatch = require('../actions/dispatch').bind(this, Q)

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

Q.process(URL.STARGAZER, function (job, done) {
  var urlEvent = job.data
  pipes.url2request(urlEvent.url)
    // STEP 1 - Save entities to db
    .then(stargazers => {
      dispatch(SAVE.STARGAZER, new StargazerEdge(
        urlEvent.invoker.id,
        stargazers.map(x => x.id)
      ))
      stargazers.forEach(user => { dispatch(SAVE.USER, user) })
      return stargazers
    })
    // STEP 2 - trigger next requests under the limit of max HOP
    .then(stargazers => {
      if (urlEvent.hop < MAX_HOP) {
        stargazers.forEach(user => {
          dispatch(URL.STARRING, new UrlEvent(
            pipes.user2starringUrl(user.login),
            user,
            urlEvent.hop + 1
          ))
        })
      }
      done()
    })
    .catch(err => {
      console.log(`Err at [${urlEvent.url}] - ${err}`)
      done()
    })
})

Q.process(URL.STARRING, function (job, done) {
  var urlEvent = job.data
  pipes.url2request(urlEvent.url)
    // STEP 1 - Save entities to db
    .then(starrings => {
      dispatch(SAVE.STARRING, new StargazingEdge(
        urlEvent.invoker.id,
        starrings.map(x => x.id)
      ))
      starrings.forEach(repo => { dispatch(SAVE.REPO, repo) })
      return starrings
    })
    // STEP 2 - trigger next requests under the limit of max HOP
    .then(starrings => {
      if (urlEvent.hop < MAX_HOP) {
        starrings.forEach(repo => {
          dispatch(URL.STARGAZER, new UrlEvent(
            pipes.repo2stargazerUrl(repo.full_name),
            repo,
            urlEvent.hop + 1
          ))
        })
      }
      done()
    })
    .catch(err => {
      console.log(`Err at [${urlEvent.url}] - ${err}`)
      done()
    })
})
