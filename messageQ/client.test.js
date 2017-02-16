var q = require('./')

q.process('email', function (job, done) {
  console.log('[email]: ', job.data)
  setInterval(() => {done()}, 1000)
})

q.process('name', function (job, done) {
  console.log('[name]: ', job.data)
  setInterval(() => {done()}, 1000)
})
