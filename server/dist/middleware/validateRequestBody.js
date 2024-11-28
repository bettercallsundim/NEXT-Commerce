"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const validateRequestBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.errors.map((err) => ({
            path: err.path,
            message: err.message,
        }));
        throw new errorHandler_1.default(400, "Error Validation");
    }
    req.body = result.data;
    next();
};
exports.default = validateRequestBody;
