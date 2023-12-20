import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

import {
  getPurchases,
  createPurchase,
  getPurchase,
  deletePurchase,
  updatePurchase,
  PurchaseDetails,
  purchaseTableView,
} from "../controllers/purchase.js";

const router = express.Router();

router.get("/getAllPurchases", getPurchases);

router.get("/purchaseTableView", purchaseTableView);

router.get("/purchaseDetails", PurchaseDetails);

router.post("/createPurchase", createPurchase);

router.get("/invoice/:id", getPurchase);

router.delete("/:id", deletePurchase);

router.patch("/:id", updatePurchase);

export default router;
