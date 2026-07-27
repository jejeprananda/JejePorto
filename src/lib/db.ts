import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

const dbPath = path.join(process.cwd(), "data", "portfolio.db");

let database: Database.Database | null = null;

function agentLog(
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown>,
  runId = "pre-fix",
) {
  // #region agent log
  const payload = {
    sessionId: "4ee316",
    runId,
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
  };
  try {
    fs.appendFileSync(
      path.join(process.cwd(), ".cursor", "debug-4ee316.log"),
      `${JSON.stringify(payload)}\n`,
    );
  } catch {
    /* ignore log IO errors */
  }
  fetch("http://127.0.0.1:7515/ingest/892ffbaf-2dde-4079-8baf-4dc503388626", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "4ee316",
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
  // #endregion
}

export function getDb(): Database.Database {
  const exists = fs.existsSync(dbPath);
  agentLog("A", "src/lib/db.ts:getDb", "getDb path check", {
    dbPath,
    exists,
    cwd: process.cwd(),
  });
  if (!exists) {
    agentLog(
      "A",
      "src/lib/db.ts:getDb:missing",
      "SQLite DB missing — build will fail",
      { dbPath, cwd: process.cwd() },
    );
    throw new Error(
      `SQLite database not found at ${dbPath}. Run \`npm run seed\` first.`,
    );
  }

  if (!database) {
    database = new Database(dbPath, { readonly: true, fileMustExist: true });
    agentLog("D", "src/lib/db.ts:getDb:opened", "SQLite DB opened successfully", {
      dbPath,
    });
  }

  return database;
}
