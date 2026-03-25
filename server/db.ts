import {Database} from "bun:sqlite";
const db = new Database("replo-takehome-asdiamond-db.sqlite", { create: true, strict: true });

db.run(`
  CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS blocks (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL,
    type TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    text_style TEXT,
    text_value TEXT,
    image_src TEXT,
    image_width INTEGER,
    image_height INTEGER,
    created_at TEXT NOT NULL,
    FOREIGN KEY (page_id) REFERENCES pages(id)
  )
`)

export default db;