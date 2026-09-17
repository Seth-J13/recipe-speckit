require("./setup");
const mysql = require("mysql2/promise");

module.exports = async () => {
  const dbName = process.env.DB_NAME || "recipe-speckit_db-test";
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW || "",
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.end();
};
