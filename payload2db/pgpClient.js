var bluebirdPromise = require('bluebird')
var pgp = require('pg-promise')({
  promiseLib: bluebirdPromise
})

class MyClient {
  constructor(config) {
    if (config === undefined) {
      config = require('./config.json')
    }
    this.db = pgp(config)
  }
  end() {
    pgp.end()
    this.db = null
  }
  /**
   * @param {Object} paylaod an instance of user
   */
  saveUser(payload) {
    console.log('[SAVE][USER]: ', payload.id, payload.login)
    return this.db.query(
      'INSERT INTO users VALUES ($1, $2::json)',
      [payload.id, payload]
    )
  }
  /**
   * @param {Array} payload an array of user objects
   */
  saveBatchUsers(payload) {
    console.log('[SAVE][BATCH_USERS]: ', payload.length, ' in total')
    // TODO
  }
  /**
   * @param {Object} payload an instance of repo
   */
  saveRepo(payload) {
    console.log('[SAVE][REPO]: ', payload.id, payload.full_name)
    return this.db.query(
      'INSERT INTO repos VALUES ($1, $2::json)',
      [payload.id, payload]
    )
  }
  /**
   * @param {Array} payload an array of repo objects
   */
  saveBatchRepos(payload, callback) {
    console.log('[SAVE][BATCH_REPOS]: ', payload.length, ' in total')
    // TODO
  }
  saveStarring(payload, callback) {
    console.log('[SAVE][STARRING]: ', payload.userid, 'count = ', payload.repolist.length)
    return this.db.query(
      'INSERT INTO starrings (userid, repolist) VALUES ($1, $2::int[])',
      [payload.userid, payload.repolist]
    )
  }
  saveStargazer(payload, callback) {
    console.log('[SAVE][STARGAZER]: ', payload.repoid, 'count = ', payload.userlist.length)
    return this.db.query(
      'INSERT INTO stargazers (repoid, userlist) VALUES ($1, $2::int[])',
      [payload.repoid, payload.userlist]
    )
  }
}

module.exports = MyClient
