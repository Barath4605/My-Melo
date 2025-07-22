import { albumState } from "../state.js";

export function favorite() {
    const favoriteButton = document.querySelector("[data-fav-btn] button");
    const favoriteButtonContainer = document.querySelector('[data-fav-btn]');
    const favoriteButtonText = document.querySelector('[data-fav-btn] h2');

    
    let favorited = false;

    favoriteButton.addEventListener("click", ()=> {
        favorited = !favorited;

        albumState.data.isFav = favorited;
        albumState.save();

        if(favorited) {
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



        console.log("FAV BTN LOADED");
    });
}