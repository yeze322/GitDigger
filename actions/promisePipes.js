var redisClient = require('../redis/redisClient')

function blockDupUrl (url) {
  return redisClient
    .saddAsync('url', url)
    .then(success => {
      if (success === 0) {
        throw 'skip dup url'
      } else {
        return url
      }
    })
}

function handleFailedUrl (url) {
  return redisClient
    .sremAsync('url', url)
    .then(success => redisClient.sadd('failed_url', url))
}

module.exports = {
  blockDupUrl,
  handleFailedUrl
}