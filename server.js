import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import venueRoutes from "./routes/venues.js";
  
dotenv.config(); 
 
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
 
// parse requests  
app.use(cors());
app.use(express.json());

// api routes — registered first so static middleware never intercepts them
app.use("/api/venues", venueRoutes);

// serve the frontend from /public
app.use(express.static(path.join(__dirname, "public")));

// fallback — return index.html for any unmatched route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
}); 
 
// connect to mongodb then boot the server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => { 
      console.log(`Server running → http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
