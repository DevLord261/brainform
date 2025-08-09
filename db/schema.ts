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
  const sql = `CREATE TABLE IF NOT EXISTS formsubmition (
    id UUID PRIMARY KEY,
    form_id UUID,
    user_id UUID,
    field_id UUID,
    value TEXT,
    data BLOB,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES form(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`;
  ContextDb.getInstance().GetDb().exec(sql);
};
