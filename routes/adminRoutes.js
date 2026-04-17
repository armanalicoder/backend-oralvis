import express from "express";
import { verifyAdmin } from "../middleware/authAdmin.js";
import { AllPatientData, getSubmissionById, OpenPDf, saveAnnotation, UploadReport } from "../controllers/adminController.js";
import uploadLocal from "../middleware/upload_local.js";

const router = express.Router();

router.get("/patient",verifyAdmin,AllPatientData);

router.get("/submission/:submissionID",verifyAdmin,getSubmissionById);

router.post("/save-annotation",verifyAdmin,saveAnnotation)

router.post("/upload-report",verifyAdmin,uploadLocal.single("file"),UploadReport)


export default router;
