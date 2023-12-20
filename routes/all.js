import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

import {
  getallproducts,
  getallproduct,
  createProduct,
  deleteallproduct,
  updateallproduct,
  getallproductBysearch,
} from "../controllers/all.js";

const router = express.Router();

router.get("/getData/:id", getallproduct);

router.get("/getData", getallproducts);

router.get("/search", getallproductBysearch);

router.post("/createProduct", createProduct);

router.delete("/deleteProduct/:id", deleteallproduct);

router.put("/updateProduct/:id", updateallproduct);

export default router;
