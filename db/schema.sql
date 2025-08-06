PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS form (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255),
  description VARCHAR(255),
  logo BLOB,
  downloadable_files VARCHAR(255),
  table_name VARCHAR(255),
  rating INTEGER,
  public_url VARCHAR(255),
  created_at TIMESTAMP,
  owner_id INTEGER,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS form_response (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form_id INTEGER,
  user_id INTEGER,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (form_id) REFERENCES form(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS form_fields (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form_id INTEGER,
  type VARCHAR(255),
  label VARCHAR(255),
  extra_attributes JSON,
  FOREIGN KEY (form_id) REFERENCES form(id)
);

CREATE TABLE IF NOT EXISTS form_answer (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  field_id INTEGER,
  response_id INTEGER,
  value VARCHAR(255),
  FOREIGN KEY (field_id) REFERENCES form_fields(id),
  FOREIGN KEY (response_id) REFERENCES form_response(id)
);
