var q = require('./')

q.process('email', function (job, done) {
  console.log('[email]: ', job.data)
  setTimeout(() => {done()}, 1000)
})

q.process('name', function (job, done) {
  console.log('[name]: ', job.data)
  setTimeout(() => {done()}, 1000)
})
