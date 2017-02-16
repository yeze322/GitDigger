let repo2repoUrl = (fullName) => `https://api.github.com/repos/${fullName}`
let repo2stargazerUrl = (fullName) => `https://api.github.com/repos/${fullName}/stargazers`
let user2starringUrl = (name) => `https://api.github.com/users/${name}/starred`
let page2urlSuffix = (page, per_page) => `?page=${page}&per_page=${per_page}`

let url2request = (uri) => ({
  uri: uri,
  headers: {
    'User-Agent': 'user2repo'
  },
  json: true
})

module.exports = {
  repo2repoUrl,
  repo2stargazerUrl,
  user2starringUrl,
  page2urlSuffix,
  url2request
}