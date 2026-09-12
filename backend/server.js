import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./lib/prisma.js";
import authRoutes from "./routes/auth.js";
import groupsRoutes from "./routes/groups.js";
const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/groups", groupsRoutes);
app.get("/", (req, res) => {
  res.send("StudySync Backend is Running");
});

app.get("/test-db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      message: "Database connected successfully",
    });
  } catch (error) {
  console.error(error);

  res.status(500).json({
    message: "Database connection failed",
    error: error.message,
  });
}
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});