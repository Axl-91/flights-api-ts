import dotenv from "dotenv";

// Load .env values
dotenv.config();

export const PORT = process.env.PORT || "3000";
