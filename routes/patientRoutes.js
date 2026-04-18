import express from "express";
const router = express.Router();
import { AllSubmission, fetchData, getSubmissionById, UploadRecord } from "../controllers/patientController.js";
import { verifyPatient } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

router.get("/",fetchData);

router.get("/submission",verifyPatient,AllSubmission);

router.get("/submission/:submissionID",verifyPatient,getSubmissionById);

router.post("/records/upload",verifyPatient,upload.array("images", 5),UploadRecord)

export default router;
