require("./setup");
const mysql = require("mysql2/promise");

module.exports = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW || "",
  });
  await connection.query(
    "CREATE DATABASE IF NOT EXISTS `recipe-speckit_db-test`"
  );
  await connection.end();
};
