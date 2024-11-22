import { Router } from "express";
import {
  createVendor,
  getAllVendors,
  getAllVendorsByUser,
  updateVendor,
} from "../controller/vendor.controller";
import { authCheck } from "../middleware/auth";
const router = Router();

router.post("/create", authCheck, createVendor);
router.patch("/update", updateVendor);
router.delete("/delete/:id", createVendor);
router.get("/allVendors", getAllVendors);
router.get("/all", authCheck, getAllVendorsByUser);

export default router;
