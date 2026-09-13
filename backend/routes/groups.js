import express from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const subject = req.query.subject?.trim();

    const groups = await prisma.group.findMany({
      where: subject ? { subject } : undefined,
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

    const safeGroups = groups.map((group) => ({
      id: group.id,
      subject: group.subject,
      name: group.name,
      description: group.description,
      memberLimit: group.memberLimit,
      currentMembers: group.members.length + 1,
      scheduledAt: group.scheduledAt,
      location: group.location,
      meetingLink: group.meetingLink,
      creator: {
        id: group.creator.id,
        email: group.creator.email,
      },
    }));

    res.json({ groups: safeGroups });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch groups",
    });
  }
});

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      where: {
        OR: [
          { creatorId: req.user.userId },
          { members: { some: { id: req.user.userId } } },
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

    const safeGroups = groups.map((group) => ({
      id: group.id,
      subject: group.subject,
      name: group.name,
      description: group.description,
      memberLimit: group.memberLimit,
      currentMembers: group.members.length + 1,
      location: group.location,
      meetingLink: group.meetingLink,
      scheduledAt: group.scheduledAt,
      creator: {
        id: group.creator.id,
        email: group.creator.email,
      },
    }));

    res.json({ groups: safeGroups });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch your groups",
    });
  }
});

router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.id);

    if (!Number.isInteger(groupId) || groupId <= 0) {
      return res.status(400).json({
        message: "A valid group ID is required",
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

    if (group.creatorId === req.user.userId) {
      return res.status(409).json({
        message: "You are already the creator of this group",
      });
    }

    const alreadyJoined = group.members.some(
      (member) => member.id === req.user.userId
    );

    if (alreadyJoined) {
      return res.status(409).json({
        message: "You have already joined this group",
      });
    }

    const totalMembers = group.members.length + 1;

    if (totalMembers >= group.memberLimit) {
      return res.status(400).json({
        message: "Group is full",
      });
    }

    await prisma.group.update({
      where: {
        id: group.id,
      },
      data: {
        members: {
          connect: {
            id: req.user.userId,
          },
        },
      },
    });

    res.status(200).json({
      message: "Joined group successfully",
      groupId: group.id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to join group",
    });
  }
});

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