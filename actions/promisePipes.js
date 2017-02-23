var redisClient = require('../redis/redisClient')

function blockDupUrl(url) {
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

module.exports = {
  blockDupUrl
}