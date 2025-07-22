fetch('./toast.html')
  .then(res => res.text())
  .then(html => {
    document.body.insertAdjacentHTML('beforeend', html);
});

export function showToast(message = "This is a Toast Message") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "font-lato opacity-0 translate-y-8 flex items-center gap-3 z-[999] w-[450px] h-[50px] transform font-semibold bg-white/30 text-black backdrop-blur-2xl text-xl px-4 py-2 rounded-4xl transition-all duration-800 ease-in-out pointer-events-auto";
  
  toast.innerHTML = `
    <i class="fa-solid fa-check backdrop-blur-2xl bg-green-600/55 p-2 px-2.5 rounded-4xl text-green-400 text-xl"></i>
    <h2>${message}</h2>
  `;

  container.appendChild(toast);

  
  setTimeout(() => {
    toast.classList.remove("translate-y-8", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
  }, 50);

  
  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-8", "opacity-0");
    setTimeout(() => toast.remove(), 800);
  }, 3000);
}

