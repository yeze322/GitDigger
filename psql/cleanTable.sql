TRUNCATE TABLE users;
TRUNCATE TABLE repos;
TRUNCATE TABLE starrings;
TRUNCATE TABLE stargazers;

ALTER SEQUENCE starrings_id_seq RESTART WITH 1;
ALTER SEQUENCE stargazers_id_seq RESTART WITH 1;