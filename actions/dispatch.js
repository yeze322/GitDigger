var Q = require('../messageQ')

function dispatch (type, payload) {
  var job = Q.create(type, payload).removeOnComplete(true)
  job.save((err) => {
    if (!err) {
      console.log(`-- [${type}] is dispatch, job id -> ${job.id}`)
    }
  })
}

module.exports = dispatch