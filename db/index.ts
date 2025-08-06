import Database from "better-sqlite3";
import Bettersqlite3 from "better-sqlite3";
import path from "path";
import * as fs from "fs";
import {
  formanswerTable,
  formfields,
  formresponeTable,
  formTable,
  userTable,
} from "./schema";

interface userVersion {
  user_version: number;
}
class ContextDb {
  private static instance: ContextDb;
  private db: Bettersqlite3.Database;
  private dbPath = path.resolve(process.cwd(), "db", "database.db");
  DB_VERSION: number = 4;
  private constructor() {
    this.db = new Database(this.dbPath, { verbose: console.log });
  }

  public static getInstance(): ContextDb {
    if (!ContextDb.instance) {
      ContextDb.instance = new ContextDb();
      ContextDb.instance.initialize();
      ContextDb.instance.updateTables();
    }

    return ContextDb.instance;
  }

  public initialize() {
    userTable();
    formanswerTable();
    formfields();
    formresponeTable();
    formTable();
  }

  public GetDb() {
    return this.db;
  }

  public updateTables() {
    const { user_version } = this.db
      .prepare("PRAGMA user_version")
      .get() as userVersion;
    console.log(user_version);
    if (user_version < this.DB_VERSION) {
      this.runMigrations(user_version);
      // Update to new version after migration
      this.db.pragma(`user_version = ${this.DB_VERSION}`);
      console.log(`[DB] Updated schema version to ${this.DB_VERSION}`);
    } else {
      console.log("[DB] No migration needed.");
    }
  }

  private runMigrations(currentVersion: number) {
    const db = this.GetDb();

    if (currentVersion < 2) {
      // v2 migration: rename username → fullname
      const columns = db.prepare("PRAGMA table_info(users);").all();
      const hasUsername = columns.some((c) => c.name === "username");
      const hasFullname = columns.some((c) => c.name === "fullname");

      if (hasUsername && !hasFullname) {
        db.exec("ALTER TABLE users RENAME COLUMN username TO fullname;");
        console.log("✅ Migrated users table to use 'fullname'.");
      }
    }
    if (currentVersion < 3) {
      const columns = db.prepare("PRAGMA table_info(users);").all();
      const hasverified = columns.some((c) => c.name === "verified");
      if (!hasverified) {
        db.exec("ALTER TABLE users ADD COLUMN verified TEXT DEFAULT false;");
        console.log("✅ Migrated users table to add 'verified'.");
      }
    }
    if (currentVersion < 4) {
      const columns = db.prepare("PRAGMA table_info(users);").all();
      const hastoken = columns.some((c) => c.name === "token");
      if (!hastoken) {
        db.exec("ALTER TABLE users ADD COLUMN token TEXT DEFAULT null;");
        console.log("✅ Migrated users table to add 'token'.");
      }
    }
  }
}

export default ContextDb;
