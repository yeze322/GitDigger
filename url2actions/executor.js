var Q = require('../messageQ')
var { SAVE, URL } = require('../actions/types')
var pipes = require('../actions/pipes')
var { UrlEvent, StargazerEdge, StargazingEdge } = require('../actions/schemas')
var dispatch = require('../actions/dispatch')

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
  var request = pipes.url2request(urlEvent.url)
  request.then(stargazers => {
    var payload = new StargazerEdge(
      urlEvent.invoker.id,
      stargazers.map(x => x.id)
    )
    dispatch(SAVE.STARGAZER, payload)
    for (let user in stargazers) {
      dispatch(SAVE.USER, user)
      var nextUrl = pipes.user2starringUrl(user.login)
      dispatch(URL.STARRING, new UrlEvent(nextUrl, user))
    }
    done()
  }).catch(err => {
    console.log('Err at: ', urlEvent.url, err)
    done()
  })
})

Q.process(URL.STARRING, function (job, done) {
  var urlEvent = job.data
  var request = pipes.url2request(urlEvent.url)
  request.then(starrings => {
    var payload = new StargazingEdge(
      urlEvent.invoker.id,
      starrings.map(x => x.id)
    )
    dispatch(SAVE.STARRING, payload)
    for (let repo in starrings) {
      dispatch(SAVE.REPO, repo)
      var nextUrl = pipes.repo2stargazerUrl(repo.full_name)
      dispatch(URL.STARGAZER, new UrlEvent(nextUrl, repo))
    }
    done()
  }).catch(err => {
    console.log('Err at: ', urlEvent.url, err)
    done()
  })
})
