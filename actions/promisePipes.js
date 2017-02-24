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

function repoid2stargazerCount (repoid) {

}

function userid2starringCount (userid) {

}

module.exports = {
  blockDupUrl,
  repoid2stargazerCount,
  userid2starringCount
}