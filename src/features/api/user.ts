import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "@/db/prisma";
import { hashPassword } from "@/lib/password";
import { Role } from "@prisma/client";

const createUserSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().min(2).max(200),
  password: z.string().min(2).max(50),
});

const updateUserSchema = z.object({
  id: z.string().min(2).max(50),
  name: z.string().min(2).max(50),
  email: z.string().min(2).max(200),
  image: z.string().optional().nullable(),
  imageMeta: z.object({}).optional().nullable(),
  role: z.nativeEnum(Role),
});

const user = new Hono()
  .post("/register", zValidator("json", createUserSchema), async (c) => {
    const userData = c.req.valid("json");

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return c.json({
        status: 400,
        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(userData.password);

    await prisma.user.create({
      data: {
        name: userData.username,
        email: userData.email,
        password: hashedPassword,
      },
    });

    return c.json({
      status: 200,
      message: "Registration successful",
    });
  })
  .get(
    "/profile",
    zValidator("query", z.object({ userId: z.string().optional() })),
    async (c) => {
      const { userId } = c.req.valid("query");
      if (!userId) {
        return c.json({
          status: 400,
          message: "Please login to view your profile",
          user: null,
        });
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          accounts: true,
        },
      });

      if (!user) {
        return c.json({
          status: 404,
          message: "User not found",
          user: null,
        });
      }

      return c.json({
        status: 200,
        message: "Profile data fetched successfully!",
        user,
      });
    }
  )
  .put("/update", zValidator("json", updateUserSchema), async (c) => {
    try {
      const userData = c.req.valid("json");

      await prisma.user.update({
        where: { id: userData.id },
        data: {
          name: userData.name,
          email: userData.email,
          image: userData.image,
          imageMeta: userData.imageMeta,
          role: userData.role,
        },
      });

      return c.json({
        status: 200,
        message: "User updated successfully",
      });
    } catch {
      return c.json({
        status: 500,
        message: "An error occurred",
      });
    }
  });

export default user;
