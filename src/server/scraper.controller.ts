import { Request, Response } from "express";
import { Scraper } from "./scraper.model";

export const getScrapers = async (req: any, res: Response) => {
  const scrapers = await Scraper.find({ userId: req.userId });
  res.json(scrapers);
};

export const addScraper = async (req: any, res: Response) => {
  const newScraper = new Scraper({ ...req.body, userId: req.userId });
  await newScraper.save();
  res.json({ message: "Scraper added" });
};
