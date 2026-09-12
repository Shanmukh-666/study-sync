import express from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
	try {
		const { subject, name, description, memberLimit } = req.body;

		if (!subject || !name || !description || !memberLimit) {
			return res.status(400).json({
				message: "Subject, name, description, and memberLimit are required",
			});
		}

		const parsedMemberLimit = Number(memberLimit);

		if (!Number.isInteger(parsedMemberLimit) || parsedMemberLimit <= 0) {
			return res.status(400).json({
				message: "memberLimit must be a positive number",
			});
		}

		const group = await prisma.group.create({
			data: {
				subject,
				name,
				description,
				memberLimit: parsedMemberLimit,
				creatorId: req.user.userId,
			},
		});

		return res.status(201).json(group);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Failed to create group",
		});
	}
});

export default router;
