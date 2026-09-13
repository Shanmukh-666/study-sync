import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

async function main() {
  const password = await bcrypt.hash("StudySync@123", 10);

  const shanmukh = await prisma.user.create({
    data: {
      email: "shanmukh@gmail.com",
      password: password,
    },
  });

  const mahesh = await prisma.user.create({
    data: {
      email: "mahesh@gmail.com",
      password: password,
    },
  });

  await prisma.group.createMany({
    data: [
      {
        subject: "Python",
        name: "PyCoders",
        description:
          "A friendly group for learning Python fundamentals, problem solving, and practical programming together.",
        memberLimit: 5,
        location: "Central Library - Room 202",
        meetingLink: "https://meet.google.com/",
        scheduledAt: new Date("2026-09-14T10:30:00"),
        creatorId: shanmukh.id,
      },
      {
        subject: "Java",
        name: "Java Masters",
        description:
          "Learn Java fundamentals, object-oriented programming, collections, exception handling, and problem solving together.",
        memberLimit: 6,
        location: "Engineering Block - Room 304",
        meetingLink: "https://meet.google.com/",
        scheduledAt: new Date("2026-09-14T14:00:00"),
        creatorId: shanmukh.id,
      },
      {
        subject: "Data Structures",
        name: "DSA Warriors",
        description:
          "Practice arrays, linked lists, stacks, queues, trees, and graphs through collaborative problem solving.",
        memberLimit: 8,
        location: "Central Library - Room 105",
        meetingLink: "https://meet.google.com/",
        scheduledAt: new Date("2026-09-15T10:00:00"),
        creatorId: shanmukh.id,
      },
      {
        subject: "Database Management",
        name: "SQL Squad",
        description:
          "Practice SQL queries, joins, normalization, transactions, and database design together.",
        memberLimit: 5,
        location: "Computer Lab - 2",
        meetingLink: "https://meet.google.com/",
        scheduledAt: new Date("2026-09-15T15:30:00"),
        creatorId: mahesh.id,
      },
      {
        subject: "Machine Learning",
        name: "ML Explorers",
        description:
          "Learn machine learning concepts and algorithms through discussions, examples, and practical study sessions.",
        memberLimit: 6,
        location: "AI Lab - Room 201",
        meetingLink: "https://meet.google.com/",
        scheduledAt: new Date("2026-09-16T11:00:00"),
        creatorId: mahesh.id,
      },
      {
        subject: "Web Development",
        name: "Full Stack Crew",
        description:
          "Learn frontend, backend, APIs, and databases while building web applications together.",
        memberLimit: 7,
        location: "Innovation Hub",
        meetingLink: "https://meet.google.com/",
        scheduledAt: new Date("2026-09-16T16:00:00"),
        creatorId: mahesh.id,
      },
      {
        subject: "Operating Systems",
        name: "OS Study Circle",
        description:
          "Study processes, threads, memory management, scheduling, synchronization, and file systems.",
        memberLimit: 5,
        location: "Engineering Block - Room 210",
        meetingLink: "https://meet.google.com/",
        scheduledAt: new Date("2026-09-17T10:30:00"),
        creatorId: shanmukh.id,
      },
      {
        subject: "Computer Networks",
        name: "Network Ninjas",
        description:
          "Study TCP/IP, routing, protocols, subnetting, and networking fundamentals together.",
        memberLimit: 6,
        location: "Central Library - Room 204",
        meetingLink: "https://meet.google.com/",
        scheduledAt: new Date("2026-09-18T14:30:00"),
        creatorId: mahesh.id,
      },
      {
        subject: "Artificial Intelligence",
        name: "AI Thinkers",
        description:
          "Explore artificial intelligence concepts and discuss intelligent systems and real-world applications.",
        memberLimit: 6,
        location: "AI Research Lab",
        meetingLink: "https://meet.google.com/",
        scheduledAt: new Date("2026-09-18T11:30:00"),
        creatorId: shanmukh.id,
      },
      {
        subject: "Software Engineering",
        name: "Code Builders",
        description:
          "Learn software engineering practices including requirements, design, testing, version control, and project management.",
        memberLimit: 8,
        location: "Seminar Hall - 1",
        meetingLink: "https://meet.google.com/",
        scheduledAt: new Date("2026-09-19T15:00:00"),
        creatorId: mahesh.id,
      },
    ],
  });

  console.log("StudySync seed completed successfully.");
  console.log("Users: shanmukh@gmail.com, mahesh@gmail.com");
  console.log("Password: StudySync@123");
  console.log("10 study groups created.");
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });