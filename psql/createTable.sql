CREATE TABLE users (
  id INT PRIMARY KEY NOT NULL,
  payload JSON NOT NULL
);

CREATE TABLE repos (
  id INT PRIMARY KEY NOT NULL,
  payload JSON NOT NULL
);

CREATE SEQUENCE starrings_id_seq;
CREATE TABLE starrings (
  id INT PRIMARY KEY DEFAULT nextval('starrings_id_seq'),
  userid INT NOT NULL,
  repolist integer[] NOT NULL
);

CREATE SEQUENCE stargazers_id_seq;
CREATE TABLE stargazers (
  id INT PRIMARY KEY DEFAULT nextval('stargazers_id_seq'),
  repoid INT NOT NULL,
  userlist integer[] NOT NULL
);
