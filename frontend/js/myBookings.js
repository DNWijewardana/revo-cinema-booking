const BOOKINGS_API = "http://localhost:5000/api/v1/bookings";

// Keep the fetched bookings so the E-Ticket can look them up by id
const bookingsById = {};

// Format an ISO date into something human
function formatDate(iso) {
    return new Date(iso).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
    });
}

// Turn a status string into a coloured pill class
function statusClass(status) {
    return `status-pill ${String(status || "PENDING").toLowerCase()}`;
}

// Build one booking card
function bookingCard(b) {
    const movie = b.movie || {};
    const poster = movie.posterUrl || "images/movieposter.jpg";
    return `
        <div class="booking-card-item">
            <div class="bc-poster">
                <img src="${poster}" alt="${movie.title || "Movie"}" />
            </div>
            <div class="bc-body">
                <h3>${movie.title || "Unknown Movie"}</h3>
                <p class="bc-meta"><i class="fas fa-language"></i> ${movie.language || "—"}</p>
                <p class="bc-meta"><i class="fas fa-couch"></i> Seats: <strong>${b.seats.join(", ")}</strong></p>
                <p class="bc-meta"><i class="fas fa-calendar-alt"></i> Booked: ${formatDate(b.createdAt)}</p>
                <div class="bc-footer">
                    <span class="bc-total">LKR ${b.totalPrice}</span>
                    <span class="${statusClass(b.paymentStatus)}">${b.paymentStatus || "PENDING"}</span>
                </div>
                <button type="button" class="next-btn bc-view" data-id="${b._id}">
                    <i class="fas fa-ticket-alt"></i> View E-Ticket
                </button>
            </div>
        </div>
    `;
}

// Render the whole list (or an empty state)
function render(bookings) {
    const container = document.getElementById("bookingsContainer");

    if (!bookings.length) {
        container.innerHTML = `
            <div class="mb-empty">
                <i class="fas fa-ticket-alt"></i>
                <h3>No bookings yet</h3>
                <p>Once you book a movie, your tickets will appear here.</p>
                <a href="ticketbooking.html" class="next-btn">Book a Movie</a>
            </div>`;
        return;
    }

    bookings.forEach((b) => (bookingsById[b._id] = b));
    container.innerHTML = bookings.map(bookingCard).join("");

    // Wire up each "View E-Ticket" button
    container.querySelectorAll(".bc-view").forEach((btn) => {
        btn.addEventListener("click", () => openTicket(btn.dataset.id));
    });
}

// E-Ticket modal
function openTicket(id) {
    const b = bookingsById[id];
    if (!b) return;
    const movie = b.movie || {};

    document.getElementById("eticket").innerHTML = `
        <div class="et-top">
            <span class="et-brand">RevoCinema</span>
            <span class="et-tag">E-TICKET</span>
        </div>
        <div class="et-movie">${movie.title || "Unknown Movie"}</div>
        <div class="et-grid">
            <div><span>Seats</span><strong>${b.seats.join(", ")}</strong></div>
            <div><span>Tickets</span><strong>${b.seats.length}</strong></div>
            <div><span>Payment</span><strong>${b.paymentMethod}</strong></div>
            <div><span>Status</span><strong>${b.paymentStatus || "PENDING"}</strong></div>
            <div><span>Total</span><strong>LKR ${b.totalPrice}</strong></div>
            <div><span>Booked</span><strong>${formatDate(b.createdAt)}</strong></div>
        </div>
        <div class="et-barcode"></div>
        <div class="et-id">Booking ID: ${b._id}</div>
    `;

    document.getElementById("ticketModal").classList.add("open");
}

function closeTicket() {
    document.getElementById("ticketModal").classList.remove("open");
}

// Boot
document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("bookingsContainer");

    try {
        const res = await fetch(`${BOOKINGS_API}/my`, { credentials: "include" });

        // Not logged in / session expired -> send them to login
        if (res.status === 401) {
            window.location.href = "login.html";
            return;
        }

        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to load bookings");
        render(data.data);
    } catch (err) {
        container.innerHTML = `
            <div class="mb-empty">
                <i class="fas fa-triangle-exclamation"></i>
                <h3>Couldn't load your bookings</h3>
                <p>${err.message}. Please make sure the server is running and try again.</p>
            </div>`;
    }

    document.getElementById("closeTicket").addEventListener("click", closeTicket);
    document.getElementById("printTicket").addEventListener("click", () => window.print());
    document.getElementById("ticketModal").addEventListener("click", (e) => {
        if (e.target.id === "ticketModal") closeTicket(); // click backdrop to close
    });
});