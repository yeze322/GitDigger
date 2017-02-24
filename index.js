var Q = require('./messageQ')
var dispatch = require('./actions/dispatch').bind(this, Q)
var { UrlEvent } = require('./actions/schemas')
var { SAVE, URL } = require('./actions/types')

var pipes = require('./actions/pipes')

function startFromRepoName (fullName) {
  var url = pipes.repoName2repoUrl(fullName)
  var request = pipes.url2request(url)
  return request
    .then(data => {
      var repoEntity = data.body
      console.log('Success', repoEntity.id, repoEntity.full_name)
      dispatch(SAVE.REPO, repoEntity)
      var nextUrls = pipes.repo2stargazerUrlList(repoEntity)
      nextUrls.forEach(url => {
        dispatch(URL.STARGAZER, new UrlEvent(url, repoEntity, 2))
      })
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