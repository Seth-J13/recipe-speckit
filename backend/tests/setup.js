const path = require("path");
const dotenv = require("dotenv");

const localEnvPath = path.join(__dirname, "..", ".env");
const envPath = path.join(__dirname, "..", ".env.test");
const examplePath = path.join(__dirname, "..", ".env.test.example");

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
}
