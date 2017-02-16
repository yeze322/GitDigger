const SAVE = {
  _TEST: 'debug.test',
  USER: 'data.user', // github user entity
  REPO: 'data.repo', // github repo entity
  STARRING: 'data.starring', // list of repos a user is starring
  STARGAZER: 'data.stargazer' // list of starrers of a repo
}

const ENTITY = {
  USER: 'entity.user',
  REPO: 'entity.repo',
  TRIGGER: 'owner_reponame'
}

const URL = {
  USER: 'url.user',
  REPO: 'url.repo',
  STARRING: 'url.starring',
  STARGAZER: 'url.stargazer'
}

module.exports = {
  SAVE,
  ENTITY,
  URL
}