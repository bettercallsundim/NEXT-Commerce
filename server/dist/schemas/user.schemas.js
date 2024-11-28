"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignIn = void 0;
// schemas/userSchema.ts
const zod_1 = require("zod");
exports.userSignIn = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    picture: zod_1.z.string().optional(),
});
