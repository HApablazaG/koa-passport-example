CREATE TABLE session (
  sid VARCHAR,
  sess JSON,
  max_age INTEGER NOT NULL,
  CONSTRAINT pk_session PRIMARY KEY (sid)
);

CREATE TABLE "user" (
  id SERIAL,
  user_id VARCHAR,
  password_hash VARCHAR,
  CONSTRAINT pk_user PRIMARY KEY (id),
  CONSTRAINT uq_user UNIQUE (user_id)
);

INSERT INTO "user" (id, user_id, password_hash) VALUES (1, 'test', '$2b$10$2LWbmqCmB2aBftpD1TOu8eWKMcl5PI313acsrGdNT7ntNr1xUAiBW');
SELECT pg_catalog.setval('user_id_seq', 1, TRUE);
