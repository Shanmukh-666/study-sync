import express from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      subject,
      name,
      description,
      memberLimit,
    } = req.body;

    if (!subject || !name || !memberLimit) {
      return res.status(400).json({
        message: "Subject, name, and member limit are required",
      });
    }

    if (memberLimit <= 0) {
      return res.status(400).json({
        message: "Member limit must be greater than 0",
      });
    }

    const group = await prisma.group.create({
      data: {
        subject,
        name,
        description,
        memberLimit: Number(memberLimit),
        creatorId: req.user.userId,
      },
    });

    res.status(201).json({
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create group",
    });
  }
});

export default router;