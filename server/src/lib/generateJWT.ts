import jwt from "jsonwebtoken";
import { User } from "../prisma-types";

export default function generateJWT(user: User) {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}
