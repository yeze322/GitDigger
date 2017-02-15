var Client = require('./psqlClient')

var client = new Client()

client.start()
client.query('SELECT * FROM t1', function (err, result) {
  console.log('err', err)
  console.log('result', result.rows)
})
client.stop()