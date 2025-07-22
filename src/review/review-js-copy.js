const ratingStars = document.querySelectorAll('#rating span');
let selectedRating = 0;
const removeRatingButton = document.getElementById('remove-rating');

const albumImg = document.getElementById('album-img');
const body = document.querySelector('body');

toggleAlbumSearch = document.querySelector('section');

let currAlbumCover;
let currAlbumId;

function getAlbumStore() {
    return JSON.parse(localStorage.getItem("albumData") || "{}");
}

function setAlbumData(albumId, data) {
    const store = getAlbumStore();
    store[albumId] = data;
    localStorage.setItem("albumData", JSON.stringify(store));
}

function getAlbumData(albumId) {
    const store = getAlbumStore();
    return store[albumId] || null;
}

function updateAlbumStore() {
    setAlbumData(currAlbumId, {
        rating: selectedRating,
        isFav: favStatus,
        inQueue: inQueue
    });
}

async function searchAlbum(e) {
    console.log("searchAlbum triggered");
    e.preventDefault();

    const query = document.querySelector('input[name="query"]').value.trim();
    if (!query) return;

    const response = await fetch(`http://localhost:8080/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    console.log("full data from backend:", data);

    if (!data || data.length === 0) {
        showToast("No results found for your search.");
        return;
    }

    const album = data[0];
    const savedData = getAlbumData(album.id) || {};

    restoreUIState(savedData);

    toggleAlbumSearch.classList.remove('invisible', 'opacity-0');
    toggleAlbumSearch.classList.add('visible', 'opacity-100');

    document.getElementById("album-img").src = album.image || 'https://via.placeholder.com/150';
    currAlbumCover = album.image;
    document.querySelector("h2.text-4xl").textContent = album.name;
    currAlbumId = album.id;
    document.querySelector("p.text-white.font-medium").textContent = album.artist;

    document.getElementById("year").textContent = album.releaseDate?.split('-')[0] || '-';
}

function toggleRemoveBtn(isVisible) {
    if (isVisible) {
        removeRatingButton.classList.remove('opacity-0', 'invisible');
        removeRatingButton.classList.add('opacity-100', 'visible');
    } else {
        removeRatingButton.classList.remove('opacity-0', 'invisible');
        removeRatingButton.classList.add('opacity-100', 'visible');
    }
}

function restoreUIState(savedData) {
    selectedRating = savedData.rating || 0;
    favStatus = savedData.isFav || false;
    inQueue = savedData.inQueue || false;

    updateRatingDisplay();
    toggleRemoveBtn(selectedRating > 0);

    if (favStatus) {
        favoriteButton.classList.remove('text-white');
        favoriteButton.classList.add('text-red-400');

        favoriteButtonContainer.classList.remove('bg-white/30', 'hover:border-white');
        favoriteButtonContainer.classList.add('bg-red-400/30', 'hover:border-red-400');

        favoriteButtonText.textContent = "Favourited!";
        favoriteButtonText.classList.add('text-red-400');
        favoriteButtonText.classList.remove('text-white');
    } else {
        favoriteButton.classList.add('text-white');
        favoriteButton.classList.remove('text-red-400');

        favoriteButtonContainer.classList.add('bg-white/30', 'hover:border-white');
        favoriteButtonContainer.classList.remove('bg-red-400/30', 'hover:border-red-400');

        favoriteButtonText.textContent = "Favourite ?";
        favoriteButtonText.classList.remove('text-red-400');
        favoriteButtonText.classList.add('text-white');
    }

    if (inQueue) {
        queueBtn.classList.remove('bg-white/30', 'hover:border-white');
        queueBtn.classList.add('bg-green-400/30', 'hover:border-green-400');

        queueBtn.querySelector('span').textContent = "Queued!";
        queueBtn.querySelector('span').classList.remove('text-white');
        queueBtn.querySelector('span').classList.add('text-green-300');

        queueBtn.querySelector('i').classList.remove('text-white');
        queueBtn.querySelector('i').classList.add('text-green-300');

        queueBtn.classList.remove('text-white');
        queueBtn.classList.add('text-green-300');
    } else {
        queueBtn.classList.add('bg-white/30', 'hover:border-white');
        queueBtn.classList.remove('bg-green-400/30', 'hover:border-green-400');

        queueBtn.querySelector('span').textContent = "Queue it";
        queueBtn.querySelector('span').classList.add('text-white');
        queueBtn.querySelector('span').classList.remove('text-green-300');

        queueBtn.querySelector('i').classList.add('text-white');
        queueBtn.querySelector('i').classList.remove('text-green-300');

        queueBtn.classList.add('text-white');
        queueBtn.classList.remove('text-green-300');
    }
}

// RATING STARS HANDLING

ratingStars.forEach((star, index) => {
    star.addEventListener('click', () => {
        selectedRating = index + 1;
        updateRatingDisplay();
        updateAlbumStore();
        toggleRemoveBtn(true);
    });

    star.addEventListener('mouseover', () => {
        highlightStars(index + 1);
    });

    star.addEventListener('mouseout', () => {
        highlightStars(selectedRating);
    });
});

function updateRatingDisplay() {
    ratingStars.forEach((star, index) => {
        if (index < selectedRating) {
            star.classList.add('text-yellow-300', 'drop-shadow-[0_0_8px_rgba(255,255,0,0.9)]');
        } else {
            star.classList.remove('text-yellow-300', 'drop-shadow-[0_0_8px_rgba(255,255,0,0.9)]');
        }
    });
}

function highlightStars(count) {
    ratingStars.forEach((star, index) => {
        if (index < count) {
            star.classList.add('text-yellow-300', 'drop-shadow-[0_0_8px_rgba(255,255,0,0.9)]');
        } else {
            star.classList.remove('text-yellow-300', 'drop-shadow-[0_0_8px_rgba(255,255,0,0.9)]');
        }
    });
}

removeRatingButton.addEventListener('click', () => {
    selectedRating = 0;
    updateAlbumStore();
    updateRatingDisplay();
    toggleRemoveBtn(false);
});

// ALBUM FULL IMAGE HANDLING

const albumFullImg = document.getElementById('album-full-img');
const albumFullImgContainer = document.getElementById('album-full-img-container');
const colorThief = new ColorThief();

albumImg.addEventListener('click', () => {
    albumFullImg.crossOrigin = "anonymous";
    albumFullImg.src = currAlbumCover;

    albumFullImg.addEventListener("load", () => {
        const color = colorThief.getColor(albumFullImg);
        const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        albumFullImg.style.filter = `drop-shadow(0 0 40px ${rgb})`;
    }, { once: true });

    albumFullImgContainer.classList.remove('opacity-0', 'invisible');
    albumFullImgContainer.classList.add('opacity-100', 'visible');
});

albumFullImgContainer.addEventListener('click', (e) => {
    if (e.target === albumFullImgContainer) {
        albumFullImgContainer.classList.remove('opacity-100', 'visible');
        albumFullImgContainer.classList.add('opacity-0', 'invisible');
    }
});

// FAVORITE ALBUM HANDLING

const favoriteButtonContainer = document.querySelector('[data-fav-btn]');
const favoriteButton = document.querySelector('[data-fav-btn] button');
const favoriteIcon = document.querySelector('[data-fav-btn] i');
let favStatus = false;
const favoriteButtonText = document.querySelector('[data-fav-btn] h2');

favoriteButton.addEventListener('click', (e) => {
    e.preventDefault();
    favStatus = !favStatus;
    updateAlbumStore();

    if (favStatus) {
        showToast("Added to Favorites!");
        favoriteButton.classList.remove('text-white');
        favoriteButton.classList.add('text-red-400');
        favoriteButtonContainer.classList.remove('bg-white/30', 'hover:border-white');
        favoriteButtonContainer.classList.add('bg-red-400/30', 'hover:border-red-400');
        favoriteButtonText.textContent = "Favourited!";
        favoriteButtonText.classList.add('text-red-400');
        favoriteButtonText.classList.remove('text-white');
    } else {
        showToast("Removed from Favorites!");
        favoriteButton.classList.add('text-white');
        favoriteButton.classList.remove('text-red-400');
        favoriteButtonContainer.classList.add('bg-white/30', 'hover:border-white');
        favoriteButtonContainer.classList.remove('bg-red-400/30', 'hover:border-red-400');
        favoriteButtonText.textContent = "Favourite ?";
        favoriteButtonText.classList.remove('text-red-400');
        favoriteButtonText.classList.add('text-white');
    }
});

const logReviewBtnContainer = document.querySelector('[data-log-review-btn]');
const logReviewBtn = document.querySelector('[data-log-review-btn] button');
const logReviewText = document.querySelector('[data-log-review-btn] span');
const logReviewIcon = document.querySelector('[data-log-review-btn] i');

const reviewSection = document.querySelector('[data-review-section]');
const submitReviewBtn = document.querySelector('[data-review-submit] button');

let isReviewVisible = false;

logReviewBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isReviewVisible = !isReviewVisible;
    reviewSection.classList.toggle('hidden');
});

submitReviewBtn.addEventListener('click', () => {
    const reviewTitle = document.querySelector('[data-review-title] input').value;
    const reviewContent = document.querySelector('[data-review-textarea] textarea').value;

    if (!(reviewTitle === '' && reviewContent === '')) {
        console.log(reviewTitle, reviewContent, selectedRating);
        toggleRemoveBtn(selectedRating > 0);
        reviewSection.classList.toggle('hidden');
        showToast("Review logged successfully!");
    } else {
        showToast("Please fill in before Submitting.");
        return;
    }

    document.querySelector('[data-review-title] input').value = '';
    document.querySelector('[data-review-textarea] textarea').value = '';

    logReviewBtnContainer.classList.remove('bg-white/30', 'hover:border-white');
    logReviewBtnContainer.classList.add('bg-yellow-400/30', 'hover:border-yellow-400');

    logReviewText.textContent = "Logged!";
    logReviewText.classList.remove('text-white');
    logReviewText.classList.add('text-yellow-400');

    logReviewIcon.classList.remove('text-white');
    logReviewIcon.classList.add('text-yellow-400');

    logReviewBtn.classList.remove('text-white');
    logReviewBtn.classList.add('text-yellow-400');

    logReviewBtnContainer.classList.remove('hover:bg-white/30');
    logReviewBtnContainer.classList.add('hover:bg-yellow-400/30');

    logReviewBtnContainer.classList.remove('hover:border-white');
    logReviewBtnContainer.classList.add('hover:border-yellow-400');
});

const reviewExit = document.querySelector('[data-review-exit] i');
reviewExit.addEventListener("click", () => {
    reviewSection.classList.toggle('hidden');
});

const queueBtn = document.querySelector('[data-queue-btn]');
let inQueue = false;
queueBtn.addEventListener('click', (e) => {
    e.preventDefault();
    inQueue = !inQueue;
    updateAlbumStore();

    if (inQueue) {
        showToast("Added to Queue!");
        queueBtn.classList.remove('bg-white/30', 'hover:border-white');
        queueBtn.classList.add('bg-green-400/30', 'hover:border-green-400');
        queueBtn.querySelector('span').textContent = "Queued!";
        queueBtn.querySelector('span').classList.remove('text-white');
        queueBtn.querySelector('span').classList.add('text-green-300');
        queueBtn.querySelector('i').classList.remove('text-white');
        queueBtn.querySelector('i').classList.add('text-green-300');
        queueBtn.classList.remove('text-white');
        queueBtn.classList.add('text-green-300');
    } else {
        showToast("Removed from Queue!");
        queueBtn.classList.add('bg-white/30', 'hover:border-white');
        queueBtn.classList.remove('bg-green-400/30', 'hover:border-green-400');
        queueBtn.querySelector('span').textContent = "Queue it";
        queueBtn.querySelector('span').classList.add('text-white');
        queueBtn.querySelector('span').classList.remove('text-green-300');
        queueBtn.querySelector('i').classList.add('text-white');
        queueBtn.querySelector('i').classList.remove('text-green-300');
        queueBtn.classList.add('text-white');
        queueBtn.classList.remove('text-green-300');
    }
});
