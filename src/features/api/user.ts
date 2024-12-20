import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "@/db/prisma";
import { hashPassword } from "@/lib/password";

const createUserSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().min(2).max(200),
  password: z.string().min(2).max(50),
});

const user = new Hono().post(
  "/register",
  zValidator("json", createUserSchema),
  async (c) => {
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
  }
);

export default user;
