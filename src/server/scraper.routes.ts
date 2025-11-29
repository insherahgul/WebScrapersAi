import express from "express";
import { authMiddleware } from "./auth.middleware";
import { getScrapers, addScraper } from "./scraper.controller";

const router = express.Router();

router.get("/", authMiddleware, getScrapers);
router.post("/", authMiddleware, addScraper);

export default router;
