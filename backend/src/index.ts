import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";


const {
  MONGODB_CONNECTION_STRING,
  FRONTEND_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

if (!MONGODB_CONNECTION_STRING) {
  throw new Error("MONGODB_CONNECTION_STRING is not defined");
}

if (!FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not defined");
}

/* ---------------- Cloudinary ---------------- */
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/* ---------------- MongoDB ---------------- */
mongoose
  .connect(MONGODB_CONNECTION_STRING)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const app = express();

/* ---------------- Middlewares ---------------- */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL!,
    ],
    credentials: true,
  })
);


/* ---------------- Routes ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
app.use("/api/my-bookings", bookingRoutes);

/* ---------------- Serve Frontend ---------------- */
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../../vite-project/dist");

  app.use(express.static(frontendDistPath));

  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

const PORT = 7000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});