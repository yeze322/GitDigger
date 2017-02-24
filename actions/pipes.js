let rp = require('request-promise')

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

let repo2stargazerUrlList = (repo) => {
  let prefix = repo2stargazerUrl(repo)
  let stargazerCnt = repo.stargazers_count
  if (!stargazerCnt) {
    return [prefix]
  }
  let per_page = 100
  let ret = []
  for (let i = 0; i < stargazerCnt / per_page; i++) {
    ret.push(prefix + _page2urlSuffix(i, per_page))
  }
  return ret
}

let user2starringUrlList = (user) => {
  
}

let _url2request = (url) => {
  console.log('[GET] ', url)
  return rp({
    uri: url,
    headers: {
      'User-Agent': 'user2repo'
    },
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
  repoName2repoUrl,
  repo2stargazerUrl,
  repo2stargazerUrlList,
  user2starringUrl,
  url2request: _test_url2request
}