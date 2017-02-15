function _onError (err) {
  console.log('error happened: ', err.message, err.stack)
}

function _defaultCallback (err, result) {
  if (err) _onError(err)
}

function _test (payload, callback) {
  let output = typeof payload === 'object'
    ? JSON.stringify(payload)
    : payload
  console.log('paylaod=', output)
}

function saveUser (payload, callback) {
  this.query(
    'INSERT INTO users VALUES ($1, $2::json)',
    [payload.id, payload],
    _defaultCallback
  )
}

function saveRepo (payload, callback) {
  this.query(
    'INSERT INTO repos VALUES ($1, $2::json)',
    [payload.id, payload],
    _defaultCallback
  )
}

function saveStarring (payload, callback) {
  this.query(
    'INSERT INTO starrings (userid, repolist) VALUES ($1, $2::int[])',
    [payload.userid, payload.repolist],
    _defaultCallback
  )
}

function saveStargazer (payload) {
  this.query(
    'INSERT INTO stargazers (repoid, userlist) VALUES ($1, $2::int[])',
    [payload.repoid, payload.userlist],
    _defaultCallback
  )
}

module.exports = {
  _test,
  saveUser,
  saveRepo,
  saveStarring,
  saveStargazer
}