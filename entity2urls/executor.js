var Q = require('../messageQ')
var { ENTITY, URL } = require('../actions/types')
var pipes = require('./pipes')
var dispatch = require('../actions/dispatch')
var { UrlEvent } = require('../actions/schemas')

Q.process(ENTITY.TRIGGER, function (job, done) {
  var repoName = job.data
  var url = pipes.repo2repoUrl(repoName)
  dispatch(URL.REPO, new UrlEvent(url, repoName))
  done()
})

Q.process(ENTITY.REPO, function (job, done) {
  var repoEntity = job.data
  var url = pipes.repo2stargazerUrl(repoEntity.full_name)
  dispatch(URL.STARGAZER, new UrlEvent(url, repoEntity))
  done()
})

Q.process(ENTITY.USER, function (job, done) {
  var userEntity = job.data
  var url = pipes.user2starringUrl(userEntity.login)
  dispatch(URL.STARRING, new UrlEvent(url, userEntity))
  done()
})
