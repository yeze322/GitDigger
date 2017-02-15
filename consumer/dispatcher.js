var TYPES = require('./types')
var handlers = require('./eventHandlers')

const handlerMap = {
  [TYPES._TEST]: handlers._test,
  [TYPES.USER]: handlers.saveUser,
  [TYPES.REPO]: handlers.saveRepo,
  [TYPES.STARRING]: handlers.saveStarring,
  [TYPES.STARGAZER]: handlers.saveStargazer
}

function dispatcher (type, payload, callback) {
  let handler = handlerMap[type]
  var ret = handler(payload)
  // if typeof ret === Promise, use Promise.then()
  if (callback) {
    callback(ret)
  }
}

module.exports = dispatcher