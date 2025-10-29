import { Router } from "express";
import { prisma } from "../prismaClient";
const router = Router();

// Get all users (for find friends)
router.get("/all", async (req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, username: true } });
  res.json(users);
});

// Add friend
router.post("/add", async (req, res) => {
  const { userId, friendId } = req.body;
  await prisma.user.update({
    where: { id: userId },
    data: { friends: { connect: { id: friendId } } },
  });
  res.json({ success: true });
});

// Get friends
router.get("/:userId", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.userId) },
    include: { friends: true },
  });
  res.json(user?.friends || []);
});

export default router;