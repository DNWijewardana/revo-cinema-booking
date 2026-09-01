const API_BASE = "http://localhost:5000/api/v1/auth";


// Show / hide password on any field with a .pw-toggle button
document.querySelectorAll(".pw-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
        const input = toggle.parentElement.querySelector("input");
        const icon = toggle.querySelector("i");
        const showing = input.type === "text";
        input.type = showing ? "password" : "text";
        icon.classList.toggle("fa-eye", showing);
        icon.classList.toggle("fa-eye-slash", !showing);
        toggle.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
});

// Display a success/error message inside the current page's message box
function showMessage(text, type) {
    const message = document.getElementById("authMessage");
    if (!message) return;
    message.textContent = text;
    message.className = "auth-message " + type;
}

// Read JSON safely even if the server returns an error / HTML page
async function safeJson(res) {
    try { return await res.json(); }
    catch { return {}; }
}

// Toggle the submit button's loading state
function setLoading(btn, isLoading, idleText) {
    btn.disabled = isLoading;
    btn.textContent = isLoading ? idleText.loading : idleText.idle;
}

// Login Page

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    const submitBtn = loginForm.querySelector(".auth-submit");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            return showMessage("Please enter both your email and password.", "error");
        }

        setLoading(submitBtn, true, { loading: "Signing in...", idle: "Login" });

        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // receive the httpOnly auth cookie
                body: JSON.stringify({ email, password })
            });
            const data = await safeJson(res);

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Login failed. Please try again.");
            }

            showMessage("Logged in successfully! Redirecting...", "success");
            setTimeout(() => { window.location.href = "index.html"; }, 1200);
        } catch (err) {
            showMessage(err.message || "Unable to reach the server.", "error");
            setLoading(submitBtn, false, { loading: "Signing in...", idle: "Login" });
        }
    });
}

// Signup Page

const signupForm = document.getElementById("signupForm");
if (signupForm) {
    const submitBtn = signupForm.querySelector(".auth-submit");

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Client-side validation mirrors the backend rules
        if (!name || !email || !password || !confirmPassword) {
            return showMessage("Please fill in all fields.", "error");
        }
        if (password.length < 6) {
            return showMessage("Password must be at least 6 characters long.", "error");
        }
        if (password !== confirmPassword) {
            return showMessage("Passwords do not match.", "error");
        }

        setLoading(submitBtn, true, { loading: "Creating account...", idle: "Create Account" });

        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, email, password })
            });
            const data = await safeJson(res);

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Registration failed. Please try again.");
            }

            showMessage("Account created successfully! Redirecting to login...", "success");
            setTimeout(() => { window.location.href = "login.html"; }, 1400);
        } catch (err) {
            showMessage(err.message || "Unable to reach the server.", "error");
            setLoading(submitBtn, false, { loading: "Creating account...", idle: "Create Account" });
        }
    });
}
