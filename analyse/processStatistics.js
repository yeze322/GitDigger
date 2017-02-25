var db = require('../psql/client')
var data = require('./statistics.json')

var userData = db
  .query(`SELECT id, payload->>'html_url' as url FROM repos`)
  .then(data => {
    console.log('total repo count: ', data.length)
    var repoDic = {}
    data.forEach(x => {
      repoDic[x.id] = x.url
    })
    return repoDic
  })
  .then(repoDic => {
    var sorted = Object.keys(data)
      .sort((a, b) => data[b] - data[a])
      .map(key => ({id: key, n: data[key], url: repoDic[key]}))
    require('fs').writeFileSync('./sorted.json', JSON.stringify(sorted), 'utf-8')
    console.log('Success')
  })





