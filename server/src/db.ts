import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
console.log("Database connected");
export default db;
