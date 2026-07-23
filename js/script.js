const titles = [
    "Developer",
    "Designer",
    "Artist"
];

const images = [
    "assets/home/developer.png",
    "assets/home/designer.png",
    "assets/home/artist.png"
];

const text = document.getElementById("changingText");
const image = document.getElementById("heroImage");

let index = 0;

function changeHero() {
    index = (index + 1) % titles.length;

    // Fade out
    image.classList.add("opacity-0");
    text.classList.add("opacity-0");

    setTimeout(() => {
        text.textContent = titles[index];
        image.src = images[index];

        // Fade in
        image.classList.remove("opacity-0");
        text.classList.remove("opacity-0");
    }, 300);
}

// Navbar link clickables........


// Change every 5 seconds
setInterval(changeHero, 5000);


document.getElementById("portfolioBtn").addEventListener("click", () => {
    document.getElementById("portfolio").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("logoLink").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = window.location.pathname;
});



const track = document.getElementById("portfolioTrack");
const buttons = document.querySelectorAll(".categoryBtn");

function truncateDescription(text, words = 6) {

    const wordArray = text.trim().split(/\s+/);

    if (wordArray.length <= words) return text;

    return wordArray.slice(0, words).join(" ") + "....";

}

let currentCategory = "2d";
let currentIndex = 0;
function loadPortfolio(category) {

    currentCategory = category;
    currentIndex = 0;

    track.innerHTML = "";

    portfolio[category].forEach(project => {

        const card = document.createElement("div");
        card.className = "portfolioCard";

        const thumb = project.media[0];

        let media = "";

        if (thumb.type === "image" || thumb.type === "gif") {

            media = `
                <img
                src="${thumb.src}"
                class="w-full h-64 object-cover">
            `;

        } else {

            media = `
                <video muted
                class="w-full h-64 object-cover">

                    <source src="${thumb.src}">

                </video>
            `;

        }

        card.innerHTML = `

            ${media}

            <div class="portfolioContent p-4">

                <h1 class="text-md font-bold">
                    ${project.title}
                </h1>

                <p class="text-gray-300 text-xs">
                    ${truncateDescription(project.description)}
                </p>

            </div>

        `;

        card.onclick = () => openGallery(project);

        track.appendChild(card);

    });

    updateSlider();

}

function updateSlider() {

    const cards = document.querySelectorAll(".portfolioCard");

    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth;
    const gap = 32;

    track.style.transform =
        `translateX(-${currentIndex * (cardWidth + gap)}px)`;

    let visibleCards = 4;

    if (window.innerWidth <= 768) {

        visibleCards = 2;

    } else if (window.innerWidth <= 1024) {

        visibleCards = 3;

    }

    portfolioPrev.style.display =
        currentIndex === 0 ? "none" : "block";

    portfolioNext.style.display =
        currentIndex >= portfolio[currentCategory].length - visibleCards
            ? "none"
            : "block";

}

portfolioNext.onclick = () => {

    if (currentIndex < portfolio[currentCategory].length - 3) {

        currentIndex++;

        updateSlider();

    }

};

portfolioPrev.onclick = () => {

    if (currentIndex > 0) {

        currentIndex--;

        updateSlider();

    }

};

buttons.forEach(button => {

    button.onclick = () => {

        buttons.forEach(btn =>
            btn.classList.remove("activeCategory"));

        button.classList.add("activeCategory");

        loadPortfolio(button.dataset.category);

    };

});

window.addEventListener("resize", () => {

    currentIndex = 0;
    updateSlider();

});

loadPortfolio("2d");


buttons.forEach(button=>{

button.onclick=()=>{

buttons.forEach(btn=>{

btn.classList.remove("activeCategory");

});

button.classList.add("activeCategory");

loadPortfolio(button.dataset.category);

};

});

const modal=document.getElementById("portfolioModal");

const modalContent=document.getElementById("modalContent");

const close=document.getElementById("closeModal");

let currentProject = null;
let currentMedia = [];

function openGallery(project) {

    currentProject = project;
    currentMedia = project.media;
    currentIndex = 0;

    document.getElementById("modalTitle").textContent =
        project.title;

    document.getElementById("modalDescription").textContent =
        project.description;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    document.body.style.overflow = "hidden";

    showCurrentMedia();
}


let currentZoom = 1;
const maxZoom = 1.5;
const minZoom = 1;
function showCurrentMedia() {

    modalContent.innerHTML = "";

    const item = currentMedia[currentIndex];
   
    if (!item) return;

    if (item.type === "image" || item.type === "gif") {

        modalContent.innerHTML = `
            <img
                id="galleryImage"
                src="${item.src}"
                class="block mx-auto max-w-full max-h-full object-contain shadow-xl transition-transform duration-200 cursor-zoom-in select-none"
                draggable="false"
                alt="">
        `;

    } else if (item.type === "video") {

        modalContent.innerHTML = `
            <video
                controls
                autoplay
                class="max-w-full max-h-full object-contain">

                <source src="${item.src}">
                Your browser does not support the video tag.

            </video>
        `;
    }

    currentZoom = 1;

    const img = document.getElementById("galleryImage");

    if (img) {

        img.style.transform = "scale(1)";

        img.addEventListener("wheel", zoomImage);
        img.addEventListener("dblclick", resetZoom);
    }
}
function zoomImage(e) {

    e.preventDefault();

    if (e.deltaY < 0) {

        currentZoom += 0.1;

    } else {

        currentZoom -= 0.1;

    }

    currentZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom));

    e.target.style.transform = `scale(${currentZoom})`;

    if (currentZoom > 1) {

        e.target.style.cursor = "zoom-out";

    } else {

        e.target.style.cursor = "zoom-in";

    }

}
function resetZoom() {

    currentZoom = 1;

    const img = document.getElementById("galleryImage");

    if (img) {
        img.style.transform = "scale(1)";
        img.style.cursor = "zoom-in";
    }

}
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

prevBtn.onclick = () => {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = currentMedia.length - 1;
    }

    showCurrentMedia();

};

nextBtn.onclick = () => {

    currentIndex++;

    if (currentIndex >= currentMedia.length) {
        currentIndex = 0;
    }

    showCurrentMedia();

};

window.addEventListener("keydown", (e) => {

    if (modal.classList.contains("hidden")) return;

    if (e.key === "ArrowLeft") {
        document.getElementById("prevBtn").click();
    }

    if (e.key === "ArrowRight") {
        document.getElementById("nextBtn").click();
    }

    if (e.key === "Escape") {
        close.click();
    }

});


close.onclick=()=>{

modal.classList.add("hidden");

modal.classList.remove("flex");

modalContent.innerHTML="";

document.body.style.overflow="auto";

};

window.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

close.click();

}

});

modal.onclick=(e)=>{

if(e.target===modal){

close.click();

}

};

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const overlay = document.getElementById("overlay");
const closeMenuBtn = document.getElementById("closeMenuBtn");

menuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("right-[-100%]");
    mobileMenu.classList.add("right-0");

    overlay.classList.remove("hidden");
});

// Close from overlay
overlay.addEventListener("click", closeMenu);

// Close from X button
closeMenuBtn.addEventListener("click", closeMenu);

// Close when a link is clicked
document.querySelectorAll("#mobileMenu a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

function closeMenu() {
    mobileMenu.classList.remove("right-0");
    mobileMenu.classList.add("right-[-100%]");

    overlay.classList.add("hidden");
}
