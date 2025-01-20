import path from "node:path";
import * as dotenv from "dotenv";

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

export const config = {
  NAME: "core-service",
  VERSION: "v1",
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  API_KEY: process.env.API_KEY || "",
  WHITELIST: [
    // DEV
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    // PROD
    "https://samjna.co.in",
    "https://prabandh.samjna.co.in",
    "https://chinta.samjna.co.in",
    "https://posha.samjna.co.in",
    "https://udvega.samjna.co.in",
  ],

  // AUTH
  SESSION_SECRET: process.env.SESSION_SECRET || "",
  OTP_EXPIRY: 5,
  OTP_RETRIES: 3,
  OTP_SUSPEND_TIME: 60,

  // MAILER
  NODEMAILER_USER: process.env.NODEMAILER_USER || "",
  NODEMAILER_PASS: process.env.NODEMAILER_PASS || "",
  NODEMAILER_FROM_EMAIL: process.env.NODEMAILER_FROM_EMAIL || "",

  // AZURE BLOB
  AZURE_SAS_TOKEN: process.env.AZURE_SAS_TOKEN || "",
  AZURE_ACCOUNT_NAME: process.env.AZURE_ACCOUNT_NAME || "",
  AZURE_CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME || "",
};
