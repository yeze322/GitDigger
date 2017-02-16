let url2request = (uri) => ({
  uri: uri,
  headers: {
    'User-Agent': 'user2repo'
  },
  json: true
})

module.exports = {
  url2request
}
