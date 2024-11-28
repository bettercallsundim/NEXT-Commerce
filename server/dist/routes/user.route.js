"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const auth_1 = require("../middleware/auth");
const validateRequestBody_1 = __importDefault(require("../middleware/validateRequestBody"));
const user_schemas_1 = require("../schemas/user.schemas");
const router = (0, express_1.Router)();
router.post("/sign-in", (0, validateRequestBody_1.default)(user_schemas_1.userSignIn), user_controller_1.googleSignIn);
router.get("/sign-out", user_controller_1.signOut);
router.get("/authPersist", auth_1.authCheck, user_controller_1.authPersist);
exports.default = router;
