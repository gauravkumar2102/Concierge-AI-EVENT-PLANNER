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

  // step 1 — call gemini first, this must succeed
  let proposal;
  try {
    proposal = await getVenueProposal(query.trim());
  } catch (err) {
    console.error("Gemini AI error:", err.message);
    return res.status(500).json({ error: "AI failed to generate a proposal. Please try again." });
  }

  // step 2 — try to save to mongodb, but don't fail the request if it errors
  let saved = null;
  try {
    saved = await Venue.create({
      userQuery: query.trim(),
      venueName: proposal.venueName,
      location: proposal.location,
      estimatedCost: proposal.estimatedCost,
      whyItFits: proposal.whyItFits,
      amenities: proposal.amenities || [],
      capacity: proposal.capacity || "",
    });
  } catch (dbErr) {
    console.error("MongoDB save failed (non-critical):", dbErr.message);
    // db failed but we still have the AI result — return it without _id
  }

  // step 3 — return the proposal whether it was saved or not
  // if saved is null, build a temporary response object from the proposal directly
  const response = saved || {
    _id: null,
    userQuery: query.trim(),
    venueName: proposal.venueName,
    location: proposal.location,
    estimatedCost: proposal.estimatedCost,
    whyItFits: proposal.whyItFits,
    amenities: proposal.amenities || [],
    capacity: proposal.capacity || "",
    createdAt: new Date().toISOString(),
    savedToDb: false,  // lets the frontend know it wasn't persisted
  };

  res.status(200).json(response);
});

// GET /api/venues — return all past searches, newest first
router.get("/", async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 }).limit(20);
    res.json(venues);
  } catch (err) {
    console.error("Failed to fetch venues:", err.message);
    // return empty array instead of crashing — frontend handles it gracefully
    res.json([]);
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
