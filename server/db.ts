import {Database} from "bun:sqlite";
const db = new Database("replo-takehome-asdiamond-db.sqlite", { create: true, strict: true });

db.run(`
  CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`)

export default db;