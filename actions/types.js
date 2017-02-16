const SAVE = {
  _TEST: 'debug.test',
  USER: 'entity.user', // github user entity
  REPO: 'entity.repo', // github repo entity
  STARRING: 'edge.starring', // list of repos a user is starring
  STARGAZER: 'edge.stargazer' // list of starrers of a repo
}

const URL = {
  USER: 'url.user',
  REPO: 'url.repo',
  STARRING: 'url.starring',
  STARGAZER: 'url.stargazer'
}

module.exports = {
  SAVE,
  URL
}