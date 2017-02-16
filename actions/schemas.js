function UrlEvent (url, invoker) {
  this.url = url
  this.invoker = invoker
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
