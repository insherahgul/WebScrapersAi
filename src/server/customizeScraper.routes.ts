import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { User } from "./user.model";
import { authMiddleware } from "./auth.middleware";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

interface AuthRequest extends Request {
  user?: any;
}

// Upload JSON for logged-in user
router.post(
  "/customize-scraper",
  authMiddleware,
  upload.single("file"),
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user.id;

      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const jsonData = JSON.parse(fs.readFileSync(path.join(req.file.path), "utf-8"));

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!user.customScrapers) user.customScrapers = [];
      user.customScrapers.push({
        filename: req.file.originalname,
        data: jsonData,
        uploadedAt: new Date(),
      });

      await user.save();

      fs.unlinkSync(req.file.path); // remove uploaded file
      res.status(200).json({ message: "File uploaded successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

export default router;
