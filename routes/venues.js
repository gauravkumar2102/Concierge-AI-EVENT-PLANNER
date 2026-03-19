import express from "express";
import Venue from "../models/Venue.js";
import { getVenueProposal } from "../services/gemini.js";

const router = express.Router();

// POST /api/venues — generate a new AI venue proposal and save it
router.post("/", async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim().length < 5) {
    return res.status(400).json({ error: "Please provide a more detailed event description." });
  }

  try {
    const proposal = await getVenueProposal(query.trim());

    const saved = await Venue.create({
      userQuery: query.trim(),
      venueName: proposal.venueName,
      location: proposal.location,
      estimatedCost: proposal.estimatedCost,
      whyItFits: proposal.whyItFits,
      amenities: proposal.amenities || [],
      capacity: proposal.capacity || "",
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error("Proposal generation failed:", err.message);
    res.status(500).json({ error: "Could not generate a venue proposal. Please try again." });
  }
});

// GET /api/venues — return all past searches, newest first
router.get("/", async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 }).limit(20);
    res.json(venues);
  } catch (err) {
    console.error("Failed to fetch venues:", err.message);
    res.status(500).json({ error: "Could not load search history." });
  }
});

// DELETE /api/venues/:id — remove a single record by id
router.delete("/:id", async (req, res) => {
  try {
    await Venue.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed successfully." });
  } catch (err) {
    console.error("Delete failed:", err.message);
    res.status(500).json({ error: "Could not delete this record." });
  }
});

export default router;
