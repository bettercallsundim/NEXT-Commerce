import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryBreadcrumb,
  getCategoryWithChildren,
} from "../controller/category.controller";

const router = Router();

router.post("/create", createCategory);
router.delete("/delete/:categoryId", deleteCategory);
router.get("/breadcrumb/:categoryId", getCategoryBreadcrumb);
router.get("/all/:categoryId", getCategoryWithChildren);

export default router;
