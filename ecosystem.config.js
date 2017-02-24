module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : "dig_db",
      script    : "./payload2db/executor.js"
    },

    // Second application
    {
      name      : "dig_url",
      script    : "./url2actions/executor.js"
    }
  ]
}
