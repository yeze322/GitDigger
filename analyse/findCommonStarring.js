var db = requrie('../psql/client')
var SortedSet = require('collections/sorted-set')

const startId = 12089001
var repoStarredTimes = {}

let concatArr = (prev, curr) => prev.concat(curr)

db
  .query(`select userlist from stargazers where repoid = ${startId}`)
  .then(data => data
    .map(x => x.userlist)
    .reduce(concatArr, [])
  )
  .then(userlist => new Set(userlist))
  .then(userSet => {
    var promiseList = []
    for (var id of userSet) {
      (function (id) {
        var promise = db
          .query(`select repolist from starrings where userid = ${id}`)
          .then(data => {
            return data
            .map(x => x.repolist)
            .reduce(concatArr, [])
          })
          .then(repolist => new Set(repolist))
          .then(repoSet => {
            for (var id of repoSet) {
              if (repoStarredTimes[id]) {
                repoStarredTimes[id] += 1
              } else {
                repoStarredTimes[id] = 1
              }
            }
          })
        promiseList.push(promise)
      })(id)
    }
    return Promise.all(promiseList)
  })
  .then(() => {
    var fs = require('fs')
    fs.writeFile('./statistics.json', JSON.stringify(repoStarredTimes), 'utf-8')
  })