var Client = require('../psql/psqlClient')

class MyClient extends Client {
  constructor(config) {
    super(config)
  }
  _test(payload, callback) {
    let output = typeof payload === 'object'
      ? JSON.stringify(payload)
      : payload
    console.log('paylaod=', output)
  }
  saveUser(payload, callback) {
    this.query(
      'INSERT INTO users VALUES ($1, $2::json)',
      [payload.id, payload],
      callback
    )
  }
  saveRepo(payload, callback) {
    this.query(
      'INSERT INTO repos VALUES ($1, $2::json)',
      [payload.id, payload],
      callback
    )
  }
  saveStarring(payload, callback) {
    this.query(
      'INSERT INTO starrings (userid, repolist) VALUES ($1, $2::int[])',
      [payload.userid, payload.repolist],
      callback
    )
  }
  saveStargazer(payload, callback) {
    this.query(
      'INSERT INTO stargazers (repoid, userlist) VALUES ($1, $2::int[])',
      [payload.repoid, payload.userlist],
      callback
    )
  }
}

module.exports = MyClient
