import express from "express";

import {
  getallcategorys,
  getallcategory,
  createcategory,
  deleteallcategory,
  updateallcategory,
} from "../controllers/category.js";

const router = express.Router();

router.get("/getData/:categoryName", getallcategory);

router.get("/getData", getallcategorys);

router.post("/createcategory", createcategory);

router.delete("/:id", deleteallcategory);

router.patch("/:id", updateallcategory);

export default router;
