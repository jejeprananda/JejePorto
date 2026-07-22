import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

const dbPath = path.join(process.cwd(), "data", "portfolio.db");

let database: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!fs.existsSync(dbPath)) {
    throw new Error(
      `SQLite database not found at ${dbPath}. Run \`npm run seed\` first.`,
    );
  }

  if (!database) {
    database = new Database(dbPath, { readonly: true, fileMustExist: true });
  }

  return database;
}
