// express.d.ts
import { User } from "@/prisma-types";
import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User; // Adjust the type based on your `user` object structure
    }
  }
}
