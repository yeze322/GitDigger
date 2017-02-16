let rp = require('request-promise')

let repo2repoUrl = (fullName) => `https://api.github.com/repos/${fullName}`
let repo2stargazerUrl = (fullName) => `https://api.github.com/repos/${fullName}/stargazers`
let user2starringUrl = (name) => `https://api.github.com/users/${name}/starred`
let page2urlSuffix = (page, per_page) => `?page=${page}&per_page=${per_page}`

let _url2request = (url) => rp({
  uri: url,
  headers: {
    'User-Agent': 'user2repo'
  },
  json: true
})

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
  repo2repoUrl,
  repo2stargazerUrl,
  user2starringUrl,
  page2urlSuffix,
  url2request: _test_url2request
}