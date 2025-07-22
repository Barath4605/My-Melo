import { albumState } from "../state.js";

let selectStar = 0;
export function setSelectStar(val) {
    selectStar = val;
}
export { selectStar };

const stars = document.querySelectorAll("#rating span");
const removeRatingButton = document.getElementById('remove-rating');

export function highlightStar() {
    
    stars.forEach((star, index) => {
        star.addEventListener('mouseover' , () => {
            highlightLight(index + 1);
        });
    })

    stars.forEach((star, index) => {
        star.addEventListener('mouseout', () => {
            highlight(selectStar);
        })
    });
}

export function selectedRating() {
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectStar = index + 1;
            highlight(selectStar);

            albumState.data.rating = selectStar;
            albumState.save();

            removeRatingButton.classList.remove('opacity-0', 'invisible');
        })
    });
}

export function removeRating() {
    removeRatingButton.addEventListener('click', () => {
        if (selectStar > 0) {
            selectStar = 0;
            highlight(selectStar);

            albumState.data.rating = selectStar;
            albumState.save();

            removeRatingButton.classList.add('opacity-0', 'invisible');
        }
    });
}

export function highlight(count) {
    stars.forEach((star, index) => {
        if(count > index) {
            star.classList.add('text-yellow-300/80', 'drop-shadow-[0_0_8px_rgba(255,255,0,0.9)]');
        } else {
            star.classList.remove('text-yellow-300/80', 'drop-shadow-[0_0_8px_rgba(255,255,0,0.9)]');
        }
    });
}

export function highlightLight(count) {
    stars.forEach((star, index) => {
        if(count > index) {
            star.classList.add('text-yellow-300/80', 'drop-shadow-[0_0_8px_rgba(255,255,0,0.9)]');
        } else {
            star.classList.remove('text-yellow-300/80 ', 'drop-shadow-[0_0_8px_rgba(255,255,0,0.9)]');
        }
    });
}

