import express from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Story 3 - Create Group
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

// Story 5 - Join Group
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.id);
    const userId = req.user.userId;

    if (Number.isNaN(groupId)) {
      return res.status(400).json({
        message: "Invalid group ID",
      });
    }

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        members: true,
      },
    });

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    const alreadyMember = group.members.some(
      (member) => member.id === userId
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "You have already joined this group",
      });
    }

    const totalMembers = group.members.length + 1; // +1 for creator

    if (totalMembers + 1 > group.memberLimit) {
      return res.status(400).json({
        message: "This group is full",
      });
    }

    await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Group joined successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to join group",
    });
  }
});

// Story 5 - My Groups
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const groups = await prisma.group.findMany({
      where: {
        OR: [
          {
            creatorId: userId,
          },
          {
            members: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json(groups);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch your groups",
    });
  }
});

export default router;