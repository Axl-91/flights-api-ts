import mysql from "mysql2/promise";
import { DB_CONFIG } from "./config";

const poolConfig = {
  ...DB_CONFIG,
  // Pool config data
  waitForConnections: true,
  connectionLimit: 5,
};

const dbPool = mysql.createPool(poolConfig);

export default dbPool;
