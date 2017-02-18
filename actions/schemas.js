function UrlEvent (url, invoker, maxHop = 0) {
  this.url = url
  this.invoker = invoker
  this.hop = maxHop
}

function StargazerEdge (repoid, userlist) {
  this.repoid = repoid
  this.userlist = userlist
}

function StargazingEdge (userid, repolist) {
  this.userid = userid
  this.repolist = repolist
}

module.exports = {
  UrlEvent,
  StargazerEdge,
  StargazingEdge
}
