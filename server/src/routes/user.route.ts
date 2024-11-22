import { Router } from "express";
import {
  authPersist,
  googleSignIn,
  signOut,
} from "../controller/user.controller";
import { authCheck } from "../middleware/auth";
import validateRequestBody from "../middleware/validateRequestBody";
import { userSignIn } from "../schemas/user.schemas";
const router = Router();

router.post("/sign-in", validateRequestBody(userSignIn), googleSignIn);

router.get("/sign-out", signOut);
router.get("/authPersist", authCheck, authPersist);

export default router;
