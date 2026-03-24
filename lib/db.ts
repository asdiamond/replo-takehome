import {Database} from "bun:sqlite";
const db = new Database("replo-takehome-asdiamond-db.sqlite", { create: true, strict: true });

export default db;