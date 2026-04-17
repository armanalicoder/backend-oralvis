import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export async function Adminlogin(req, res) {
  try {
    const { email, password } = req.body;
    const data = await Admin.findOne({ email });

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
        name: data.name,
        email: data.email,
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
