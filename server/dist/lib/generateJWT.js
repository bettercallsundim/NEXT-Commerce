"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateJWT(user) {
    return jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}
