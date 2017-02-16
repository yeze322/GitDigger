var pg = require('pg')

class Client {
  constructor(config) {
    if (config === undefined) {
      config = require('./config.json')
    }
    this.config = config
  }
  start() {
    this.pool = new pg.Pool(this.config)
  }
  stop() {
    this.pool.end()
  }
  query() {
    return this.pool.query(...arguments)
  }
}

module.exports = Client