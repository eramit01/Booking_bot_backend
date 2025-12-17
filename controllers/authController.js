import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }    const user = await User.findOne({ email });    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });   }    
      const isMatch = await user.comparePassword(password);
     if (!isMatch) {
       return res.status(401).json({ message: "Invalid credentials" });
     }
     const token = jwt.sign(
       { sub: user._id, role: user.role, email: user.email },
       process.env.JWT_SECRET || "supersecret",
      { expiresIn: "7d" }
    );     res.json({
      token,
      user: {
         id: user._id,
         name: user.name,
         email: user.email,
         role: user.role,
       },
     });
   } catch (error) {
     next(error);
   }
};

