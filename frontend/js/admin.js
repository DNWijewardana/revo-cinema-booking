const API = "http://localhost:5000/api/v1";

// Guard: only admins may see this page
async function ensureAdmin() {
    try {
        const res = await fetch(`${API}/auth/me`, { credentials: "include" });
        if (!res.ok) { window.location.href = "login.html"; return null; }   // not logged in
        const { data: user } = await res.json();
        if (user.role !== "ADMIN") { window.location.href = "index.html"; return null; } // logged in, not admin
        return user;
    } catch {
        window.location.href = "login.html";
        return null;
    }
}

// Small helper: GET a protected admin resource
async function getJSON(path) {
    const res = await fetch(`${API}${path}`, { credentials: "include" });
    return res.json();
}

// Stats
async function loadStats() {
    const { data } = await getJSON("/admin/stats");
    document.getElementById("statMovies").textContent = data.movies;
    document.getElementById("statUsers").textContent = data.users;
    document.getElementById("statBookings").textContent = data.bookings;
    document.getElementById("statRevenue").textContent = data.revenue.toLocaleString();
}

// Movies table (with delete)
async function loadMovies() {
    const { data } = await getJSON("/movies");
    const body = document.querySelector("#moviesTable tbody");

    body.innerHTML = `
        <tr class="thead"><th>Poster</th><th>Title</th><th>Language</th><th>Rating</th><th>Showing</th><th>Action</th></tr>
        ${data.map((m) => `
            <tr>
                <td><img src="${m.posterUrl}" class="table-thumb" alt="" /></td>
                <td>${m.title}</td>
                <td>${m.language}</td>
                <td>${m.rating}</td>
                <td>${m.nowShowing ? "✅" : "⏳"}</td>
                <td><button class="del-btn" data-id="${m._id}"><i class="fas fa-trash"></i></button></td>
            </tr>`).join("")}
    `;

    // Wire delete buttons
    body.querySelectorAll(".del-btn").forEach((btn) => {
        btn.addEventListener("click", () => deleteMovie(btn.dataset.id));
    });
}

async function deleteMovie(id) {
    if (!confirm("Delete this movie? This cannot be undone.")) return;
    const res = await fetch(`${API}/movies/${id}`, { method: "DELETE", credentials: "include" });
    const data = await res.json();
    if (data.success) { loadMovies(); loadStats(); }
    else alert(data.message || "Delete failed");
}

// Users table
async function loadUsers() {
    const { data } = await getJSON("/admin/users");
    const body = document.querySelector("#usersTable tbody");
    body.innerHTML = `
        <tr class="thead"><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
        ${data.map((u) => `
            <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td><span class="role-tag ${u.role.toLowerCase()}">${u.role}</span></td>
                <td>${new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>`).join("")}
    `;
}

// Bookings table
async function loadBookings() {
    const { data } = await getJSON("/admin/bookings");
    const body = document.querySelector("#bookingsTable tbody");
    body.innerHTML = `
        <tr class="thead"><th>User</th><th>Movie</th><th>Seats</th><th>Total</th><th>Status</th><th>Date</th></tr>
        ${data.map((b) => `
            <tr>
                <td>${b.user ? b.user.name : "—"}</td>
                <td>${b.movie ? b.movie.title : "—"}</td>
                <td>${b.seats.join(", ")}</td>
                <td>LKR ${b.totalPrice}</td>
                <td><span class="status-pill ${(b.paymentStatus || "PENDING").toLowerCase()}">${b.paymentStatus || "PENDING"}</span></td>
                <td>${new Date(b.createdAt).toLocaleDateString()}</td>
            </tr>`).join("")}
    `;
}

// Add movie 
function wireAddMovie() {
    const form = document.getElementById("addMovieForm");
    const msg = document.getElementById("addMovieMsg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const body = {
            title: document.getElementById("am-title").value.trim(),
            posterUrl: document.getElementById("am-poster").value.trim(),
            language: document.getElementById("am-language").value.trim(),
            rating: document.getElementById("am-rating").value.trim(),
            // "Action, Thriller" -> ["Action", "Thriller"]
            genre: document.getElementById("am-genre").value.split(",").map((g) => g.trim()).filter(Boolean),
            releaseDate: document.getElementById("am-release").value,
            description: document.getElementById("am-description").value.trim(),
            nowShowing: document.getElementById("am-nowshowing").checked,
        };

        try {
            const res = await fetch(`${API}/movies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || "Failed to add movie");

            msg.textContent = "Movie added successfully!";
            msg.className = "auth-message success";
            form.reset();
            loadMovies();
            loadStats();
        } catch (err) {
            msg.textContent = err.message;
            msg.className = "auth-message error";
        }
    });
}

// Boot
document.addEventListener("DOMContentLoaded", async () => {
    const admin = await ensureAdmin();
    if (!admin) return; // Guard already redirected

    wireAddMovie();
    loadStats();
    loadMovies();
    loadUsers();
    loadBookings();
});