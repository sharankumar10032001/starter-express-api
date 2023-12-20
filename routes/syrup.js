import express from "express";
import {verifyToken} from '../middleware/verifyToken.js';

import {
  getUsers,
  login,
  sendmail,
  activeUsers,
  noactiveUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/CustomerDetails.js";

const router = express.Router();



router.get("/getData",verifyToken, getUsers);


router.get("/active", activeUsers);

router.get("/noactive", noactiveUsers);

router.post("/signup", createUser);

router.post("/login", login);

router.post("/sendmail", sendmail);

router.get("/checkid/:id", getUser);

router.delete("/:id", deleteUser);

router.patch("/:id", updateUser);


export default router;
