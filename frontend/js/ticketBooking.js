const API_URL = "http://localhost:5000/api/v1"; // Update this backend URL when deploying to production
const SEAT_PRICE = 800; // LKR per seat
const TOTAL_SEATS = 80;

// State
let dbMovies = []; // Movies loaded from the database
let selectedMovie = null; // The movie selected by the user
let bookedSeats = []; // Already booked seats for the selected movie
let selectedSeats = []; // Seat ids the user is choosing now

document.addEventListener("DOMContentLoaded", () => {
    // DOM references
    const movieSelect = document.getElementById("movie");
    const poster = document.getElementById("poster");
    const movieName = document.getElementById("movie-name");
    const movieDetails = document.getElementById("movie-details");
    const genreEl = document.getElementById("genre");
    const ratingEl = document.getElementById("rating");

    const seatContainer = document.querySelector(".all-seats");
    const seatMovieTitle = document.getElementById("seat-movie-title");
    const countEl = document.querySelector(".count");
    const amountEl = document.querySelector(".amount");

    const steps = document.querySelectorAll(".step");
    const nextButtons = document.querySelectorAll(".next-btn");
    const prevButtons = document.querySelectorAll(".prev-btn");
    const confirmBtn = document.querySelector(".confirm-btn");
    let currentStep = 1;

    // Step navigation
    function goToStep(step) {
        steps[currentStep - 1].classList.remove("active");
        currentStep = step;
        steps[currentStep - 1].classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    nextButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            if (currentStep === 1) {
                if (!selectedMovie) return alert("Please select a movie first.");
                await loadSeats(); // fetch taken seats before showing the map
            }
            if (currentStep === 2) {
                if (selectedSeats.length === 0) return alert("Please select at least one seat.");
                renderSummary();
            }
            if (currentStep < steps.length) goToStep(currentStep + 1);
        });
    });

    prevButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (currentStep > 1) goToStep(currentStep - 1);
        });
    });

    // Load movies into the dropdown
    async function fetchMovies() {
        try {
            const res = await fetch(`${API_URL}/movies`);
            const data = await res.json();
            if (!data.success) throw new Error("Could not load movies");

            dbMovies = data.data;
            movieSelect.innerHTML = `<option value="" disabled selected>Select a movie</option>`;
            dbMovies.forEach((movie, index) => {
                const opt = document.createElement("option");
                opt.value = index;
                opt.textContent = movie.title;
                movieSelect.appendChild(opt);
            });
        } catch (err) {
            console.error("Error fetching movies:", err);
            movieSelect.innerHTML = `<option value="" disabled selected>Failed to load movies</option>`;
        }
    }

    // Show selected movie details
    movieSelect.addEventListener("change", (e) => {
        selectedMovie = dbMovies[e.target.value];
        if (!selectedMovie) return;

        poster.src = selectedMovie.posterUrl || "images/movieposter.jpg";
        poster.onerror = () => { poster.src = "images/movieposter.jpg"; };
        movieName.textContent = selectedMovie.title;
        movieDetails.textContent = selectedMovie.description;
        genreEl.textContent = Array.isArray(selectedMovie.genre)
            ? selectedMovie.genre.join(", ")
            : selectedMovie.genre;
        ratingEl.textContent = selectedMovie.rating;
    });

    // Fetch booked seats + render the seat map
    async function loadSeats() {
        bookedSeats = [];
        selectedSeats = [];
        updateTotals();

        try {
            const res = await fetch(`${API_URL}/bookings/seats/${selectedMovie._id}`);
            const data = await res.json();
            if (data.success) bookedSeats = data.bookedSeats || [];
        } catch (err) {
            console.error("Error fetching booked seats:", err);
        }
        renderSeats();
    }

    function renderSeats() {
        seatMovieTitle.textContent = selectedMovie.title;
        seatContainer.innerHTML = "";

        for (let i = 1; i <= TOTAL_SEATS; i++) {
            const seatId = `s${i}`;
            const isBooked = bookedSeats.includes(seatId);

            const input = document.createElement("input");
            input.type = "checkbox";
            input.name = "tickets";
            input.id = seatId;
            input.disabled = isBooked;

            const label = document.createElement("label");
            label.htmlFor = seatId;
            label.className = "seat" + (isBooked ? " booked" : "");

            input.addEventListener("change", () => {
                if (input.checked) selectedSeats.push(seatId);
                else selectedSeats = selectedSeats.filter((s) => s !== seatId);
                updateTotals();
            });

            seatContainer.appendChild(input);
            seatContainer.appendChild(label);
        }
    }

    function updateTotals() {
        countEl.textContent = selectedSeats.length;
        amountEl.textContent = selectedSeats.length * SEAT_PRICE;
    }

    // Confirmation summary
    function renderSummary() {
        document.getElementById("summary-movie").textContent = selectedMovie.title;
        document.getElementById("summary-seats").textContent = selectedSeats.join(", ");
        document.getElementById("summary-total").textContent = selectedSeats.length * SEAT_PRICE;
    }

    // Confirm booking (protected)
    if (confirmBtn) {
        confirmBtn.addEventListener("click", async () => {
            const messageEl = document.getElementById("bookingMessage");
            const paymentMethod = document.getElementById("paymentMethod").value;
            confirmBtn.disabled = true;
            confirmBtn.textContent = "Processing...";

            try {
                const res = await fetch(`${API_URL}/bookings`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include", // send the JWT auth cookie
                    body: JSON.stringify({
                        movieId: selectedMovie._id,
                        seats: selectedSeats,
                        totalPrice: selectedSeats.length * SEAT_PRICE,
                        paymentMethod,
                    }),
                });

                // Not logged in → bounce to login
                if (res.status === 401) {
                    messageEl.className = "auth-message error";
                    messageEl.textContent = "Please log in to complete your booking. Redirecting...";
                    return setTimeout(() => { window.location.href = "login.html"; }, 1500);
                }

                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.message || "Booking failed. Please try again.");
                }

                messageEl.className = "auth-message success";
                messageEl.textContent = "🎉 Booking confirmed! Enjoy the show.";
                confirmBtn.textContent = "Confirmed";
            } catch (err) {
                messageEl.className = "auth-message error";
                messageEl.textContent = err.message || "Unable to reach the server.";
                confirmBtn.disabled = false;
                confirmBtn.textContent = "Confirm Payment";
            }
        });
    }

    // Kick things off
    fetchMovies();
});
