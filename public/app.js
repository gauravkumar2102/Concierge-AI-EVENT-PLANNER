const API = "/api/venues";


document.addEventListener("DOMContentLoaded", () => {
  loadHistory();

  document.getElementById("query-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSearch();
    }
  });
});


async function handleSearch() {
  const input = document.getElementById("query-input");
  const query = input.value.trim();

  if (!query || query.length < 5) {
    showError("Please describe your event in a bit more detail.");
    return;
  }

  clearError();
  setLoading(true);

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.error || "Something went wrong. Please try again.");
      return;
    }

    showResult(data);
    input.value = "";
    loadHistory();

    document
      .getElementById("result-section")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    showError("Network error — is the server running?");
  } finally {
    setLoading(false);
  }
}


function showResult(venue) {
  const section = document.getElementById("result-section");
  const container = document.getElementById("result-card");

  container.innerHTML = buildCard(venue, true);
  container.dataset.id = venue._id;
  section.classList.remove("hidden");
}


async function loadHistory() {
  try {
    const res = await fetch(API);
    const venues = await res.json();

    const grid = document.getElementById("history-grid");
    const empty = document.getElementById("empty-msg");
    const count = document.getElementById("history-count");

    if (!Array.isArray(venues) || venues.length === 0) {
      grid.innerHTML = "";
      empty.classList.remove("hidden");
      count.textContent = "";
      return;
    }

    empty.classList.add("hidden");
    count.textContent = venues.length + " saved";
    grid.innerHTML = venues.map((v) => buildCard(v, false)).join("");
  } catch (err) {
    console.error("Could not load history:", err);
  }
}

// ── delete a saved record ───────────────────────────
async function deleteVenue(id) {
  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");

    // hide featured card if it matches
    const resultCard = document.getElementById("result-card");
    if (resultCard.dataset.id === id) {
      document.getElementById("result-section").classList.add("hidden");
    }

    loadHistory();
  } catch (err) {
    console.error("Delete error:", err);
  }
}

// ── build card html ─────────────────────────────────
function buildCard(venue, featured) {
  const amenityHTML = (venue.amenities || [])
    .map((a) => `<span class="amenity">${a}</span>`)
    .join("");

  const date = new Date(venue.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const meta = [venue.location, venue.capacity].filter(Boolean).join(" · ");

  return `
    <div class="venue-card ${featured ? "is-featured" : ""}" data-id="${venue._id}">
      <div class="card-top">
        <div class="venue-name">${venue.venueName}</div>
        <span class="cost-tag">${venue.estimatedCost}</span>
      </div>
      <div class="venue-meta">
        <span class="meta-dot">◆</span>
        <span>${meta}</span>
      </div>
      <p class="why-it-fits">${venue.whyItFits}</p>
      ${amenityHTML ? `<div class="amenities-list">${amenityHTML}</div>` : ""}
      <div class="card-footer">
        <span class="query-text">"${venue.userQuery}"</span>
        <span class="card-date">${date}</span>
        <button class="btn-delete" onclick="deleteVenue('${venue._id}')">Remove</button>
      </div>
    </div>
  `;
}

// ── ui helpers ──────────────────────────────────────
function setLoading(on) {
  const btn     = document.getElementById("search-btn");
  const label   = document.getElementById("btn-label");
  const spinner = document.getElementById("btn-spinner");

  btn.disabled = on;
  label.textContent = on ? "Planning..." : "Plan My Event";
  spinner.classList.toggle("hidden", !on);
}

function showError(msg) {
  const el = document.getElementById("error-msg");
  el.textContent = msg;
  el.classList.remove("hidden");
}

function clearError() {
  const el = document.getElementById("error-msg");
  el.textContent = "";
  el.classList.add("hidden");
}
