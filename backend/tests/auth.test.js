/**
 * Feature 2 — Sign In & Sign Out
 * Spec: features/feature-2-sign-in-sign-out.md
 */
const mysql = require("mysql2/promise");
const request = require("supertest");
const app = require("../server");
const db = require("../app/models");
const { getSalt, hashPassword } = require("../app/authentication/crypto");

const existingUser = {
  firstName: "Danny",
  lastName: "Devito",
  email: "DDevito@example.com",
  password: "secret",
};

function basicAuth(email, password) {
  return `Basic ${Buffer.from(`${email}:${password}`).toString("base64")}`;
}

async function seedUser() {
  const salt = await getSalt();
  const hash = await hashPassword(existingUser.password, salt);
  return db.user.create({
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    email: existingUser.email,
    password: hash,
    salt,
  });
}

describe("Feature 2 — Sign In & Sign Out", () => {
  beforeAll(async () => {
    const admin = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PW,
    });
    await admin.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await admin.end();
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  beforeEach(async () => {
    await db.session.destroy({ where: {} });
    await db.user.destroy({ where: {} });
    await seedUser();
  });

  describe("US-2.1 — Sign in", () => {
    it("Successful login", async () => {
      // TS-F2-AC001
      const res = await request(app)
        .post("/recipeapi/login")
        .set("Authorization", basicAuth(existingUser.email, existingUser.password));

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(existingUser.email);
      expect(res.body.firstName).toBe(existingUser.firstName);
      expect(res.body.lastName).toBe(existingUser.lastName);
      expect(res.body.id).toEqual(expect.any(Number));
      expect(res.body.token).toEqual(expect.any(String));
      expect(res.body.password).toBeUndefined();
      expect(res.body.salt).toBeUndefined();
    });

    it("Bad email", async () => {
      // TS-F2-AC002
      const res = await request(app)
        .post("/recipeapi/login")
        .set("Authorization", basicAuth("nobody@example.com", existingUser.password));

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("User not found!");
    });

    it("Bad password", async () => {
      // TS-F2-AC003
      const res = await request(app)
        .post("/recipeapi/login")
        .set("Authorization", basicAuth(existingUser.email, "wrong-password"));

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid password!");
    });
  });
});
