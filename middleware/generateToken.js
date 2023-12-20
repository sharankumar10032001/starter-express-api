import jwt from "jsonwebtoken";
import config from "../config/config.js";

export function generateJwtToken(data) {
  console.log("token to geneate data:", data);
  var token = jwt.sign(data, config.jwtSecret, { expiresIn: "2d" });
  return token;
}
