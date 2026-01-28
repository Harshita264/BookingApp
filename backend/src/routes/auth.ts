import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import verifyToken from "../middleware/auth";

const router = express.Router();

/* ================= REGISTER ================= */

router.post(
  "/register",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }

      const { firstName, lastName, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = new User({
        firstName,
        lastName,
        email,
        password,
      });

      await user.save();

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        path: "/",
      });

      return res.status(201).json({ userId: user.id });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

/* ================= LOGIN ================= */

router.post("/login", async (req: Request, res: Response) => {
  try {
    console.log("LOGIN ROUTE HIT", req.body.email);

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 86400000,
    });

    return res.status(200).json({ userId: user.id });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

/* ================= VALIDATE TOKEN ================= */
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).json({ userId: req.userId });
});

/* ================= LOGOUT ================= */
router.post("/logout", (_req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    expires: new Date(0),
  });
  res.sendStatus(200);
});

export default router;
