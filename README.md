# ◈ Concierge — AI Event Planner

A full-stack AI-powered corporate event planning platform. Describe your event in plain English and get a structured venue proposal, stored persistently in MongoDB.
LIVE LINK-https://concierge-ai-event-planner.vercel.app



https://github.com/user-attachments/assets/ac0f49d4-b79a-4426-8513-d776ef003044



## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Runtime  | Node.js (ESM modules)             |
| Server   | Express.js                        |
| AI       | gemini-3-flash-preview            |
| Database | MongoDB + Mongoose                |
| Frontend | Vanilla HTML / CSS / JS           |

## Project Structure

```
concierge/
├── server.js              # Express entry point
├── package.json
├── .env.example
├── .gitignore
├── models/
│   └── Venue.js           # Mongoose schema
├── routes/
│   └── venues.js          # API routes (GET, POST, DELETE)
├── services/
│   └── gemini.js          # Gemini AI integration
└── public/
    ├── index.html         # Frontend markup
    ├── style.css          # Styles
    └── app.js             # Frontend logic
```

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/concierge.git
cd concierge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/event-concierge
PORT=5000
```

- **Gemini API key** → https://aistudio.google.com/app/apikey (free)
- **MongoDB** → run locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier

### 4. Start the server

```bash
npm run dev     # development (auto-restarts on file changes)
npm start       # production
```

Open http://localhost:5000

## API Reference

### `POST /api/venues`
Generate a new venue proposal.

**Request body**
```json
{ "query": "A 10-person leadership retreat in the mountains for 3 days with a $4k budget" }
```

**Response**
```json
{
  "_id": "...",
  "userQuery": "...",
  "venueName": "Eagle Peak Lodge",
  "location": "Aspen, Colorado",
  "estimatedCost": "$3,500 - $4,000",
  "whyItFits": "...",
  "amenities": ["Private boardroom", "Mountain views", "Catering", "Hiking trails"],
  "capacity": "Up to 12 guests",
  "createdAt": "..."
}
```

### `GET /api/venues`
Returns all past searches, newest first (max 20).

### `DELETE /api/venues/:id`
Removes a single record by ID.

4. Use a **MongoDB Atlas** connection string for `MONGODB_URI`
