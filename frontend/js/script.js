document.addEventListener("DOMContentLoaded", () => {
    let currentStep = 1;

    // HANDLE NEXT AND PREVIOUS BUTTONS 

    const steps = document.querySelectorAll(".step");
    const nextButtons = document.querySelectorAll(".next-btn");
    const prevButtons = document.querySelectorAll(".prev-btn");

    nextButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (currentStep < steps.length) {
                steps[currentStep - 1].classList.remove("active");
                currentStep++;
                steps[currentStep - 1].classList.add("active");
            }
        });
    });

    prevButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (currentStep > 1) {
                steps[currentStep - 1].classList.remove("active");
                currentStep--;
                steps[currentStep - 1].classList.add("active");
            }
        });
    });


// PICK A SEAT

let seats = document.querySelector(".all-seats");
for (let i = 0; i < 79; i++) {
    let randint = Math.floor(Math.random() * 2);
    let booked = randint === 1 ? "booked" : "";

    seats.insertAdjacentHTML(
        "beforeend",
        `<input type="checkbox" name="tickets" id="s${i + 2}"/>
        <label for="s${i + 2}" class="seat ${booked}"></label>`
    )
}

let tickets = seats.querySelectorAll("input");
tickets.forEach((ticket) => {
    ticket.addEventListener("change", () => {
        let amount = document.querySelector(".amount").innerHTML;
        let count = document.querySelector(".count").innerHTML;

        amount = Number(amount);
        count = Number(count);

        if (ticket.checked) {
            count += 1;
            amount += 800;
        }
        else {
            count -= 1;
            amount -= 800;
        }
        document.querySelector(".amount").innerHTML = amount;
        document.querySelector(".count").innerHTML = count;
    })
})

// ===============

    // Payment Method Selection
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const paymentInfo = document.querySelector(".payment-info");

    paymentRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
            paymentInfo.innerHTML = ""; // Clear previous inputs
            if (radio.value === "PayPal") {
                paymentInfo.innerHTML = `<input type="email" placeholder="PayPal Email" required>`;
            } else {
                paymentInfo.innerHTML = `
                    <input type="text" placeholder="Card Number" required>
                    <input type="text" placeholder="Expiry Date (MM/YY)" required>
                    <input type="text" placeholder="CVV" required>
                `;
            }
        });
    });
});


/////////////////////////////

// Movie data
const movies = {
    movie1: {
        name: "How to Train Your Dragon",
        poster: "images/Movies1.jpg",
        details: "Hiccup and Toothless reunite to remind both their kinds of the inseparable bond between vikings and dragons.",
        genre: "Sci-Fi, Thriller",
        rating: "8.8/10"
    },
    movie2: {
        name: "Heretic",
        poster: "images/Movies4.jpg",
        details: "Two young religious women are drawn into a game of cat-and-mouse in the house of a strange man.",
        genre: "Horror, Thriller",
        rating: "7.7/10"
    },
    movie3: {
        name: "Kraven the Hunter",
        poster: "images/Movies3.jpg",
        details: "Kraven's complex relationship with his ruthless father, Nikolai Kravinoff, starts him down a path of vengeance with brutal consequences, motivating him to become not only the greatest hunter in the world, but also one of its most feared.",
        genre: "Action, Thriller",
        rating: "6.8/10"
    },
    movie4: {
        name: "Smile 2",
        poster: "images/Movies5.jpg",
        details: "About to embark on a world tour, global pop sensation Skye Riley begins experiencing increasingly terrifying and inexplicable events. Overwhelmed by the escalating horrors and the pressures of fame, Skye is forced to face her past.",
        genre: "Horror, Mystery, Thriller",
        rating: "8.1/10"
    },
    movie5: {
        name: "Godzilla x Kong",
        poster: "images/Movies6.jpg",
        details: "Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island's mysteries.",
        genre: "Action, Adventure, Fantasy, Sci-Fi, Thriller",
        rating: "8.9/10"
    },
    movie6: {
        name: "The Beekeeper",
        poster: "images/Movies7.jpg",
        details: "A kind-hearted landlady commits suicide after falling victim to a phishing scam, leading former 'Beekeeper' operative Adam Clay to set out on a brutal campaign for revenge upon those responsible.",
        genre: "Action, Crime, Thriller",
        rating: "7.8/10"
    },
    movie7: {
        name: "Sihina Nelum Mal",
        poster: "images/Movies13.jpg",
        details: "A heartfelt journey through love, loss, and dreams, 'Sihina Nelum Mal' weaves a tale of resilience as a young artist confronts the boundaries of passion and destiny while searching for meaning in a world of fleeting beauty.",
        genre: "Drama, Romance, Thriller",
        rating: "8.0/10"
    },
    movie8: {
        name: "Amaran",
        poster: "images/Movies14.jpg",
        details: "The life of Major Mukund Varadarajan and is set against the backdrop of the Qazipathri Operation in Shopian, Kashmir, which took place back in 2014.",
        genre: "Action, Biography, Drama, War",
        rating: "7.3/10"
    }
};

// DOM elements
const movieSelect = document.getElementById("movie");
const poster = document.getElementById("poster");
const movieName = document.getElementById("movie-name");
const movieDetails = document.getElementById("movie-details");
const genre = document.getElementById("genre");
const rating = document.getElementById("rating");

// Event listener for movie selection
movieSelect.addEventListener("change", (event) => {
    const selectedMovie = movies[event.target.value];

    if (selectedMovie) {
        poster.src = selectedMovie.poster;
        movieName.textContent = selectedMovie.name;
        movieDetails.textContent = selectedMovie.details;
        genre.textContent = selectedMovie.genre;
        rating.textContent = selectedMovie.rating;
    }
});
