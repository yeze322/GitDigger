function dispatch (Q, type, payload) {
  var priority = payload.hop || 0
  var job = Q.create(type, payload).removeOnComplete(true).priority(priority)
  job.save((err) => {
    if (err) {
      let output = typeof err === 'object'
        ? JSON.stringify(err)
        : err
      console.log(`[Error] -> [${type}]: ${output}`)
    }
  })
}

module.exports = dispatch