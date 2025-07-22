import { showToast } from "../../toast-message/toast.js";
import { albumState } from "../state.js";

export function queue() {
    const queueBtn = document.querySelector("[data-queue-btn]");

    if(albumState.data.isFav) {
        queueBtn.classList.remove('hover:border-white', 'hover:backdrop-contrast-75' , 'hover:scale-102');
        queueBtn.classList.add('bg-white/10' , 'backdrop-blur-xl');

        return;
    }

    let queue = false;
    queueBtn.addEventListener("click", () => {
        queue = !queue;

        albumState.data.inQueue = queue;
        albumState.save();


        if(queue) {
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
}