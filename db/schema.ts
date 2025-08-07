import ContextDb from ".";

export const userTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      fullname VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      token VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `;

  ContextDb.getInstance().GetDb().exec(sql);
};

export const formTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS form (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(255),
    imageUrl BLOB,
    tableName VARCHAR(255),
    fields JSON,
    public_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    owner_id INTEGER,
    FOREIGN KEY (owner_id) REFERENCES users(id)
  );`;
  ContextDb.getInstance().GetDb().exec(sql);
};

export const formresponeTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS form_response (
    id UUID PRIMARY KEY,
    form_id INTEGER,
    user_id INTEGER,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES form(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`;
  ContextDb.getInstance().GetDb().exec(sql);
};

export const formfields = () => {
  const sql = `CREATE TABLE IF NOT EXISTS form_fields (
    id UUID PRIMARY KEY,
    form_id INTEGER,
    type VARCHAR(255),
    label VARCHAR(255),
    extra_attributes JSON,
    FOREIGN KEY (form_id) REFERENCES form(id)
  );`;
  ContextDb.getInstance().GetDb().exec(sql);
};

export const formanswerTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS form_answer (
    id UUID PRIMARY KEY,
    field_id INTEGER,
    response_id INTEGER,
    value VARCHAR(255),
    FOREIGN KEY (field_id) REFERENCES form_fields(id),
    FOREIGN KEY (response_id) REFERENCES form_response(id)
  );`;
  ContextDb.getInstance().GetDb().exec(sql);
};
