import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

import {
  getBills,
  createBill,
  getBill,
  deleteBill,
  updateBill,
  BillDetails,
  billTableView,
} from "../controllers/billing.js";

const router = express.Router();

router.get("/getAllBills", getBills);

router.get("/billTableView", billTableView);

router.get("/billDetails", BillDetails);

router.post("/createBill", createBill);

router.get("/invoice/:id", getBill);

router.delete("/:id", deleteBill);

router.patch("/:id", updateBill);

export default router;
