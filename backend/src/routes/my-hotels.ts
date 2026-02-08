import express, { Request, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body, validationResult } from "express-validator";
import { HotelType } from "../shared/types";

const router = express.Router();

/* =========================
   CLOUDINARY CONFIG (REQUIRED)
========================= */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/* =========================
   CREATE HOTEL
========================= */
router.post(
  "/",
  verifyToken,
  upload.array("imageFiles", 6),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight").isNumeric().withMessage("Price must be a number"),
    body("starRating").isNumeric().withMessage("Star rating is required"),
    body("adultCount").isNumeric().withMessage("Adult count is required"),
    body("childCount").isNumeric().withMessage("Child count is required"),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const imageFiles = req.files as Express.Multer.File[];
      if (!imageFiles || imageFiles.length === 0) {
        return res.status(400).json({ message: "At least one image is required" });
      }

      const imageUrls = await uploadImages(imageFiles);

      const facilities =
        typeof req.body.facilities === "string"
          ? req.body.facilities.split(",")
          : req.body.facilities;

      const newHotel = new Hotel({
        userId: req.userId,
        name: req.body.name,
        city: req.body.city,
        country: req.body.country,
        description: req.body.description,
        type: req.body.type,
        starRating: Number(req.body.starRating),
        adultCount: Number(req.body.adultCount),
        childCount: Number(req.body.childCount),
        pricePerNight: Number(req.body.pricePerNight),
        facilities,
        imageUrls,
        lastUpdated: new Date(),
      });

      await newHotel.save();
      res.status(201).json(newHotel);
    } catch (error) {
      console.error("SAVE HOTEL ERROR:", error);
      res.status(500).json({ message: "Failed to add hotel" });
    }
  }
);

/* =========================
   GET MY HOTELS
========================= */
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

/* =========================
   UPDATE HOTEL
========================= */
router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId, userId: req.userId },
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const files = req.files as Express.Multer.File[];
      if (files && files.length > 0) {
        const updatedImageUrls = await uploadImages(files);
        hotel.imageUrls = [...updatedImageUrls, ...(hotel.imageUrls || [])];
      }

      await hotel.save();
      res.status(200).json(hotel);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update hotel" });
    }
  }
);

/* =========================
   DELETE HOTEL
========================= */
router.delete("/:hotelId", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findOneAndDelete({
      _id: req.params.hotelId,
      userId: req.userId,
    });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete hotel" });
  }
});

/* =========================
   IMAGE UPLOAD HELPER
========================= */
async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = image.buffer.toString("base64");
    const dataURI = `data:${image.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI);
    return result.secure_url;
  });

  return Promise.all(uploadPromises);
}

export default router;
