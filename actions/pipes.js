let rp = require('request-promise')

let reponame2repoUrl = (fullName) => `https://api.github.com/repos/${fullName}`
let repo2stargazerUrl = (repo) => `https://api.github.com/repos/${repo.full_name}/stargazers`
let user2starringUrl = (user) => `https://api.github.com/users/${user.login}/starred`
let page2urlSuffix = (page, per_page) => `?page=${page}&per_page=${per_page}`

let _url2request = (url) => {
  console.log('[GET] ', url)
  return rp({
    uri: url,
    headers: {
      'User-Agent': 'user2repo'
    },
    json: true
  })
}

var _testGraph = require('./testgraph.json')
let _test_url2request = (url) => {
  return new Promise((resolve, reject) => {
    let value = _testGraph[url]
    if (value) {
      resolve(value)
    } else {
      reject('No Content.')
    }
  })
}

module.exports = {
  repoName2repoUrl,
  repo2stargazerUrl,
  user2starringUrl,
  page2urlSuffix,
  url2request: _test_url2request
}