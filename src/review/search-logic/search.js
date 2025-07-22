import { showToast } from "../../toast-message/toast.js";
import { highlight, removeRating, setSelectStar } from "../rating-stars/star-highlight.js";
import { albumState } from "../state.js";
import { tracklist } from "../tracklist/tracklist.js";
console.log(showToast)

const toggleAlbumSearch = document.querySelector('section');

export async function searchAlbum(e) {
    e.preventDefault();

    const form = e.target;
    const query = form.querySelector('input[name="query"]').value.trim();

    if(!query) {
        showToast("Search cannot be Empty!");
        return;
    }

    const response = await fetch(`http://localhost:8080/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();

    const album = data[0];

    albumState.load(album.id);

    albumState.data.name = album.name;
    albumState.data.artist = album.artist;
    albumState.data.year = album.year;

    toggleAlbumSearch.classList.remove('invisible', 'opacity-0');
    toggleAlbumSearch.classList.add('visible', 'opacity-100');

    updateAlbumDisplay(album);
    restoreUIState(albumState.data);
    await tracklist(album.id);

    albumState.save();

}

document.querySelector('form').addEventListener("submit" , searchAlbum);


export function updateAlbumDisplay(album) {
    const cover = document.getElementById('album-img').src = album.image;
    const artist = document.getElementById('artist-name').textContent = album.artist;
    const name = document.getElementById('album-name').textContent = album.name;
    const year = document.getElementById('album-year').textContent = album.releaseDate?.split("-")[0] || "-";

    console.log(cover, artist, name, year);

}

function restoreUIState(data) {
    setSelectStar(albumState.data.rating || 0);
    const currentRating = albumState.data.rating || 0;
    const removeRatingBtn = document.getElementById('remove-rating');

    if (currentRating > 0) {
        removeRatingBtn.classList.remove('opacity-0', 'invisible');
        removeRating();
    } else {
        removeRatingBtn.classList.add('opacity-0', 'invisible');
    }

    highlight(currentRating);

    const favoriteButton = document.querySelector("[data-fav-btn] button");
    const favoriteButtonContainer = document.querySelector("[data-fav-btn]");
    const favoriteButtonText = document.querySelector("[data-fav-btn] h2");

    if (albumState.data.inQueue) {
        favoriteButton.classList.remove(
            'hover:border-white',
            'hover:scale-102',
            'hover:backdrop-contrast-75'
        );
        favoriteButton.classList.add(
            'pointer-events-none',
            'opacity-40',
            'cursor-not-allowed'
        );
        favoriteButtonText.textContent = "Favorite Disabled";
    } else if (albumState.data.isFav) {
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

    const queueBtn = document.querySelector("[data-queue-btn]");

    if (albumState.data.isFav) {
        queueBtn.classList.remove(
            'hover:border-white',
            'hover:scale-102',
            'hover:backdrop-contrast-75'
        );
        queueBtn.classList.add(
            'pointer-events-none',
            'opacity-40',
            'cursor-not-allowed'
        );
        queueBtn.querySelector('span').textContent = "Queue";
        return;
    } else if (albumState.data.inQueue) {
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
