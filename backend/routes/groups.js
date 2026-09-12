import express from 'express';
import prisma from '../lib/prisma.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      subject,
      name,
      description,
      memberLimit,
      location,
      meetingLink,
      scheduledAt,
    } = req.body;

    if (!subject || !name || !memberLimit) {
      return res.status(400).json({
        message: 'Subject, name, and member limit are required',
      });
    }

    if (memberLimit <= 0) {
      return res.status(400).json({
        message: 'Member limit must be greater than 0',
      });
    }

    let parsedScheduledAt = undefined;
    if (scheduledAt) {
      parsedScheduledAt = new Date(scheduledAt);
      if (isNaN(parsedScheduledAt.getTime())) {
        return res.status(400).json({
          message: 'Invalid scheduled date and time format',
        });
      }
    }

    const group = await prisma.group.create({
      data: {
        subject,
        name,
        description,
        memberLimit: Number(memberLimit),
        location,
        meetingLink,
        scheduledAt: parsedScheduledAt,
        creatorId: req.user.userId,
      },
    });

    res.status(201).json({
      message: 'Group created successfully',
      group,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to create group',
    });
  }
});

// GET all groups
router.get('/', authMiddleware, async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { id: 'desc' },
    });

    res.json({ groups });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to fetch groups',
    });
  }
});

// GET single group by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const group = await prisma.group.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!group) {
      return res.status(404).json({
        message: 'Group not found',
      });
    }

    res.json({ group });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to fetch group',
    });
  }
});

// DELETE group (creator only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const group = await prisma.group.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!group) {
      return res.status(404).json({
        message: 'Group not found',
      });
    }

    if (group.creatorId !== req.user.userId) {
      return res.status(403).json({
        message: 'Only the group creator can delete this group',
      });
    }

    await prisma.group.delete({
      where: { id: group.id },
    });

    res.json({
      message: 'Group deleted successfully',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to delete group',
    });
  }
});

export default router;