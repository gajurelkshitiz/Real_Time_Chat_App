import { Router } from "express";
import { prisma } from "../prismaClient";
// import bcrypt from "bcrypt";
const bcrypt = require('bcrypt');
// import jwt from "jsonwebtoken";
const jwt = require('jsonwebtoken');

const router = Router();

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return res.status(400).json({ message: "Username already exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username },
  });

  // store password hash separately (or in user if added in schema)
  await prisma.$executeRaw`UPDATE "User" SET "password" = ${hash} WHERE "id" = ${user.id}`;

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET!);
  res.json({ token, user });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  // fetch stored hash (assuming we added password field)
  const data: any = await prisma.$queryRaw`SELECT "password" FROM "User" WHERE "id" = ${user.id}`;
  const hash = data?.[0]?.password;
  if (!hash || !(await bcrypt.compare(password, hash)))
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET!);
  res.json({ token, user });
});

export default router;
