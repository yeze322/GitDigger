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
    this.columnSet = {
      USER: pgp.helpers.ColumnSet(['id', 'payload'], 'users'),
      REPO: pgp.helpers.ColumnSet(['id', 'payload'], 'repos'),
      STARRING: pgp.helpers.ColumnSet(['userid', 'repolist'], 'starrings'),
      STARGAZER: pgp.helpers.ColumnSet(['repoid', 'userlist'], 'stargazers')
    }
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
    var data = {
      id: payload.id,
      payload: payload
    }
    var query = pgp.helpers.insert(data, this.columnSet.USER)
    return this.db.query(query)
  }
  /**
   * @param {Array} payload an array of user objects
   */
  saveBatchUsers(payload) {
    console.log('[SAVE][BATCH_USERS]: ', payload.length, ' in total')
    // TODO
  }
  /**
   * @description keep an example of using raw query
   * @param {Object} payload an instance of repo
   */
  saveRepo(payload) {
    console.log('[SAVE][REPO]: ', payload.id, payload.full_name)
    return this.db.query(
      'INSERT INTO repos VALUES ($1, $2)',
      [payload.id, payload]
    )
  }
  /**
   * @param {Array} payload an array of repo objects
   */
  saveBatchRepos(payload) {
    console.log('[SAVE][BATCH_REPOS]: ', payload.length, ' in total')
    // TODO
  }
  saveStarring(payload) {
    console.log('[SAVE][STARRING]: ', payload.userid, 'count = ', payload.repolist.length)
    var data = {
      userid: payload.userid,
      repolist: payload.repolist
    }
    var query = pgp.helpers.insert(data, this.columnSet.STARRING)
    return this.db.query(query)
  }
  saveStargazer(payload) {
    console.log('[SAVE][STARGAZER]: ', payload.repoid, 'count = ', payload.userlist.length)
    var data = {
      repoid: payload.repoid,
      userlist: payload.userlist
    }
    var query = pgp.helpers.insert(data, this.columnSet.STARGAZER)
    return this.db.query(query)
  }
  /**
   * @description abstraction of insert procedure
   */
  insert(type, payload) {
    var payload2data = {}
    var transformFunc = payload2data[type]
    var data = transformFunc(payload)
    var column = this.columnSet[type]
    var query = pgp.helpers.insert(data, column)
    console.log('find from dictionary')
    return this.db.query(query)
  }
  /**
   * @description implement an extendable db client for dealing data of multi types
   * @param {enum} type data type of the payload data
   * @param {function} transformer transform payload to table data format
   * @param {Object} target json contains target table name / table column names
   */
  registerType(type, transformer, target) {
    
  }
}

module.exports = MyClient
