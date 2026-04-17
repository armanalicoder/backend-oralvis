import dotenv from "dotenv";
import express from "express";
import connectToDB from "./db/connectDB.js";
import authRoutes from "./routes/Authentication.js";
import patientRoute from "./routes/patientRoutes.js";
import adminRoute from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"
import { verifyPatient } from "./middleware/authMiddleware.js";
import { verifyAdmin } from "./middleware/authAdmin.js";

const app = express();
const port = 8000;
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CORS config
app.use(cors({
  origin: 'https://oralvishealthcareportal.onrender.com',
  methods: ['GET', 'POST', 'PUT','PATCH','DELETE'],
  credentials: true
}));

app.get("/ping", (req, res) => {
  res.json({ alive: true, time: new Date() });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

await connectToDB();

app.listen(port, () => {
  console.log("App is listening on port", port);
});

app.get("/", (req, res) => {
  res.redirect("https://oralvishealthcareportal.onrender.com");
});

app.get("/api/auth/check", verifyPatient, (req, res) => {
  res.json({ success: true, user: req.user });
});

app.get("/api/auth/admin", verifyAdmin, (req, res) => {
  res.json({ success: true, user: req.user });
});

app.use("/api/auth", authRoutes);

app.use("/api/patient",patientRoute)
app.use("/api/admin",adminRoute)
