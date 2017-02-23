var Q = require('./messageQ')
var dispatch = require('./actions/dispatch').bind(this, Q)
var { UrlEvent } = require('./actions/schemas')
var { SAVE, URL } = require('./actions/types')

var pipes = require('./actions/pipes')

function startFromRepoName (fullName) {
  var url = pipes.repoName2repoUrl(fullName)
  var request = pipes.url2request(url)
  return request
    .then(repoEntity => {
      console.log('Success', repoEntity.id, repoEntity.full_name)
      dispatch(SAVE.REPO, repoEntity)
      var nextUrl = pipes.repo2stargazerUrl(repoEntity)
      dispatch(URL.STARGAZER, new UrlEvent(nextUrl, repoEntity, 2))
    })
    .catch(err => {
      console.log('Err: ', err)
    })
}

startFromRepoName('vuejs/vue')
  // .then(() => {
  //   Q.shutdown(5000, (err) => {
  //     console.log('Kue shutdown: ', err || 'success!')
  //     process.exit(0)
  //   })
  // })