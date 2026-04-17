import jwt from "jsonwebtoken";

export function verifyPatient(req, res, next) {
  try {
    const token = req.cookies.token; // 👈 cookie se token
    if (!token) {
      return res.status(401).json({ msg: "No token, unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded && decoded.role == "patient") {
      req.user = decoded; // payload ko req.user me save
      next();
    } else {
      return res.status(401).json({ success: false, msg: "Unauthorized!" });
    }
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
}
