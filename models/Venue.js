import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
  {
    userQuery: {
      type: String,
      required: true,
      trim: true,
    },
    venueName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    estimatedCost: {
      type: String,
      required: true,
    },
    whyItFits: {
      type: String,
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    capacity: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Venue = mongoose.model("Venue", venueSchema);

export default Venue;
