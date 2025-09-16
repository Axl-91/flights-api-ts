import dotenv from 'dotenv';

// Load .env values
dotenv.config();

export const PORT = process.env.PORT || '3000';

export const DB_CONFIG = {
  // DB config data
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
};
