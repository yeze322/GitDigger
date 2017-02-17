function UrlEvent (url, invoker, hop = 0) {
  this.url = url
  this.invoker = invoker
  this.hop = hop
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
