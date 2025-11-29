import express, { Request, Response } from "express";
import { User } from "./user.model";
import { authMiddleware } from "./auth.middleware";

interface AuthRequest extends Request {
  user?: any;
}

const router = express.Router();

// Protected dashboard
// Protected dashboard
router.get("/dashboard", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userDoc = await User.findById(req.user.id).select("-password");
    if (!userDoc) return res.status(404).json({ message: "User not found" });
    const user = userDoc.toObject();

    // Example: fetch scrapers for this user
    const scrapers = await Scraper.find({ owner: req.user.id }).lean(); // lean() for plain JS

    console.log(`📊 Dashboard viewed by: ${user.name} (${user.email})`);

    res.status(200).json({ message: "Dashboard loaded", user, scrapers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard request failed" });
  }
});



export default router;
