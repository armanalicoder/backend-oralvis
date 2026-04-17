import express from "express";
const router = express.Router();
import { register, login } from "../controllers/patientAuthController.js";
import { Adminlogin } from "../controllers/adminAuth.js";

router.post("/register", register);

router.post("/patient-login", login);

router.post("/admin-login", Adminlogin);

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/", 
  });
  return res
    .status(200)
    .json({ success: true, msg: "Logged out successfully" });
});

export default router;
