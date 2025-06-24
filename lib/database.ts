// lib/db.ts
import { Pool } from "pg";

const connectionString = process.env.CONNECTION_STRING;

if (!connectionString) throw new Error("Connection string not defined");

export const pool = new Pool({
  connectionString,
});
