import Patient from "../models/patientModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const { fullname, email, password } = req.body;
    const count = await Patient.countDocuments();

    const nextNumber = count + 1;

    // PatientId e.g., P001, P002, ...
    const patientId = "P" + String(nextNumber).padStart(3, "0");

    //Check already exist or not
    const isExist = await Patient.findOne({ email: email });
    if (isExist) {
      return res
        .status(409)
        .json({ success: false, msg: "You're already registered!" });
    } else {
      // Now save patient here in db
      const newPatient = new Patient({
        name: fullname,
        email: email,
        patientID: patientId,
        password: password,
      });
      await newPatient.save();
      res.status(201).json({
        success: true,
        msg: "Patient registered successfully",
        patientId,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const data = await Patient.findOne({ email });

    if (!data) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid email or password!" });
    }

    const isValid = await bcrypt.compare(password, data.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid email or password!" });
    }

    // JWT Token generate
    const token = jwt.sign(
      {
        id: data._id,
        email: data.email,
        patientID: data.patientID,
        role: data.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // 1 ghante baad expire hoga
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "none", // cross-domain cookies allow
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      success: true,
      msg: "Login Successful",
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}
