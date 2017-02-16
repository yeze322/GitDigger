const TYPES = {
  _TEST: 'debug.test',
  USER: 'entity.user', // github user entity
  REPO: 'entity.repo', // github repo entity
  STARRING: 'edge.starring', // list of repos a user is starring
  STARGAZER: 'edge.stargazer' // list of starrers of a repo
}

module.exports = TYPES