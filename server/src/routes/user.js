import express from "express";
import * as AuthController from "../controllers/user.js";
import { verifyAuth, Roles } from "../middleware/verifyAuth.js";
import limitRequests from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/signup", limitRequests, AuthController.signUp);
router.post("/signin", limitRequests, AuthController.signIn);
router.post("/signinViaMail", limitRequests, AuthController.signInViaEmail);
router.post(
  "/sendVerifyMail/:userId",
  limitRequests,
  AuthController.sendVerifyEmail
);

router.get(
  "/verifyLoginLink/:userId/:emailToken",
  limitRequests,
  AuthController.verifyLoginLink
);

router.get("/user", verifyAuth(Roles.All), AuthController.authenticateUser);

router.patch(
  "/verifyEmail/:userId/:verificationToken",
  limitRequests,
  AuthController.verifyEmail
);

export default router;
