import jwt from "jsonwebtoken"; // used to create, sign, and verify tokens
import config from "../config/config.js";

export function verifyToken(req, res, next) {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      res.status(403).json({
        statusCode: 403,
        hasError: true,
        message: "Access Token are Not Passed In Header Auth",
      });
    } else {
      jwt.verify(accessToken, config.jwtSecret, function (err, decoded) {
        if (err) {
          res.status(403).json({
            statusCode: 403,
            hasError: true,
            message: "Invalid token",
          });
        } else {
          console.log("--<decoded", decoded);

          next();
        }
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Token verification failed ",
      data: error,
    });
  }
}
