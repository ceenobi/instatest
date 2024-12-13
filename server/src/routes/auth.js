import express from "express";
import * as AuthController from "../controllers/auth.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { cacheMiddleware } from "../config/cache.js";

const router = express.Router();

router.post("/signup", AuthController.signUp);
router.post("/signin", authLimiter, AuthController.signIn);
router.post("/signinViaMail", authLimiter, AuthController.signInViaEmail);
router.post(
  "/sendVerifyMail/:userId",
  authLimiter,
  AuthController.sendVerifyEmail
);

router.get(
  "/verifyLoginLink/:userId/:emailToken",
  authLimiter,
  AuthController.verifyLoginLink
);

router.get(
  "/user",
  verifyAuth(Roles.All),
  cacheMiddleware("get_auser", 300),
  AuthController.authenticateUser
);

router.patch(
  "/verifyEmail/:userId/:verificationToken",
  authLimiter,
  AuthController.verifyEmail
);

router.get("/refreshAccessToken", AuthController.refreshAccessToken);

router.post("/logout", AuthController.logout);

export default router;
