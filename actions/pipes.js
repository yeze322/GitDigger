let rp = require('request-promise')
let config = require('../config.json')

let repoName2repoUrl = (fullName) => `https://api.github.com/repos/${fullName}`
let repo2stargazerUrl = (repo) => `https://api.github.com/repos/${repo.full_name}/stargazers`
let user2starringUrl = (user) => `https://api.github.com/users/${user.login}/starred?per_page=100`
let _page2urlSuffix = (page, per_page) => `?page=${page}&per_page=${per_page}`

let link2nextUrl = (link) => {
  let re = /<(.+)>; rel="next"/
  let match = re.exec(link)
  if (match) {
    return match[1]
  }
  return null
}

let link2progress = (link) => {
  let re_nxt = /<.+&page=([0-9]+)>; rel="next"/
  let re_last = /<.+&page=([0-9]+)>; rel="last"/
  let match_nxt = re.exec(link)
  let match_last = re.exec(link)
  if (match_nxt && match_last) {
    return match_nxt[1] + '/' + match_last[1]
  }
  return '-/' + match_last[1]
}

let repo2stargazerUrlList = (repo) => {
  let prefix = repo2stargazerUrl(repo)
  let stargazerCnt = repo.stargazers_count
  if (!stargazerCnt) {
    return [prefix]
  }
  let per_page = 100
  let ret = []
  for (let i = 1; i < stargazerCnt / per_page + 1; i++) {
    ret.push(prefix + _page2urlSuffix(i, per_page))
  }
  return ret
}

let user2starringUrlList = (user) => {
  
}

let _url2request = (url) => {
  console.log('[GET] ', url)
  let headers = {'User-Agent': 'user2repo'}
  if (config.github.withtoken) headers['Authorization'] = config.github.token
  return rp({
    uri: url,
    headers: headers,
    json: true,
    resolveWithFullResponse: true
  })
}

var _testGraph = require('./testgraph.json')
let _test_url2request = (url) => {
  console.log('[GET]- ', url)
  return new Promise((resolve, reject) => {
    let value = _testGraph[url]
    if (value) {
      resolve({ body: value })
    } else {
      reject('No Content.')
    }
  })
}

module.exports = {
  link2nextUrl,
  link2progress,
  repoName2repoUrl,
  repo2stargazerUrl,
  repo2stargazerUrlList,
  user2starringUrl,
  url2request: require('../config.json').testmode ? _test_url2request : _url2request
}