import jwt from "jsonwebtoken";

export function verifyAdmin(req, res, next) {
  try {
    const token = req.cookies.token; // cookie se token
    if (!token) {
      return res.status(401).json({ msg: "No token, unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded && decoded.role=="admin"){
        req.admin = decoded;
        next();
    }else{
        return res.status(401).json({ msg: "Unauthorized!" });
    }
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
}
