const AUTH_API = "http://localhost:5000/api/v1/auth";

// Ask the backend who the current user is
async function getCurrentUser() {
    try {
        const res = await fetch(`${AUTH_API}/me`, { credentials: "include" });
        if (!res.ok) return null;
        const data = await res.json();
        return data.success ? data.data : null;
    } catch {
        return null; // Backend down / not logged in
    }
};

// Logout, then refresh the page state
async function logout() {
    try {
        await fetch(`${AUTH_API}/logout`, { method: "POST", credentials: "include" });
    } catch {
        // Ignore errors
    }
    window.location.href = "index.html";
}

// Render the navbar area based on auth state
function renderAuthArea(user) {
    const area = document.getElementById("authArea");
    if (!area) return;

    if (!user) {
        area.innerHTML = `<a href="login.html" class="login-btn">Login</a>`;
        return;
    }

    const firstName = (user.name || "Guest").split(" ")[0];
    const isAdmin = user.role === "ADMIN";

    area.innerHTML = `
        <div class="user-menu">
            <button class="user-chip" id="userChip">
                <i class="fas fa-user-circle"></i>
                <span>${firstName}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="user-dropdown" id="userDropdown">
                <a href="myBookings.html"><i class="fas fa-ticket-alt"></i> My Bookings</a>
                ${isAdmin ? `<a href="adminDashboard.html"><i class="fas fa-cog"></i> Admin Panel</a>` : ""}
                <button type="button" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</button>
            </div>
        </div>
    `;

    // Toggle the dropdown
    const chip = document.getElementById("userChip");
    const dropdown = document.getElementById("userDropdown");
    chip.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("open");
    });
    document.addEventListener("click", () => dropdown.classList.remove("open"));

    document.getElementById("logoutBtn").addEventListener("click", logout);
}

// Boot
document.addEventListener("DOMContentLoaded", async () => {
    const user = await getCurrentUser();
    renderAuthArea(user);
});

