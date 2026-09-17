const path = require("path");
const dotenv = require("dotenv");

const localEnvPath = path.join(__dirname, "..", ".env");
const envPath = path.join(__dirname, "..", ".env.test");
const examplePath = path.join(__dirname, "..", ".env.test.example");
const localEnvPath = path.join(__dirname, "..", ".env");

dotenv.config({ path: localEnvPath });
dotenv.config({ path: envPath });
dotenv.config({ path: examplePath });

process.env.NODE_ENV = "test";
process.env.DB_NAME = "recipe-speckit_db-test";

const crypto = require("crypto");
const secretBytes = process.env.SECRET_KEY
  ? Buffer.from(process.env.SECRET_KEY, "base64")
  : Buffer.alloc(0);
if (secretBytes.length < 32) {
  process.env.SECRET_KEY = crypto.randomBytes(32).toString("base64");
dotenv.config({ path: envPath, override: true });
dotenv.config({ path: examplePath });

process.env.NODE_ENV = "test";

if (!process.env.SECRET_KEY) {
  process.env.SECRET_KEY = Buffer.alloc(32, 1).toString("base64");
}

if (!process.env.DB_NAME || !String(process.env.DB_NAME).includes("test")) {
  process.env.DB_NAME = "recipe-speckit_db-test";
}
