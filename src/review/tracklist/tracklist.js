

export async function tracklist(id) {

    if(!id) {console.error("UNDEFINED ID");}
    
    const list = await fetch(`http://localhost:8080/spotify/album/${id}/tracks`);
    const trackData = await list.json();
    console.log(id);

    const trackList = document.getElementById('track-list');
    trackList.innerHTML = '';
    
    trackData.forEach((track, i) => {
        const li = document.createElement('li');

        console.log(track.name);
        console.log(track.url);

        li.className = "flex justify-between bg-black/20 items-center m-2 p-2 text-white rounded-md backdrop-blur-xl hover:scale-102  transition-all ease-in-out duration-500";
        li.innerHTML = `
            <div class="group transition-all ease-in-out duration-700">
                <h4 class="font-medium text-sm text-white/40">Track ${i+1}</h4>
                <h3 class="line-clamp-2 group-hover:line-clamp-none transition-all ease-in-out duration-700">${track.name}</h3>
            </div>
            
            <div class="">
                <a href="${track.url}" class="hover:text-green-500 transition-all ease-in-out duration-300" title="Listen On Spotify" target="_blank"><i class="fa-solid fa-music p-2 hover:bg-white rounded-2xl transition-all ease-in-out duration-500"></i></a>
            </div>
        `;

        trackList.appendChild(li);
    });


}