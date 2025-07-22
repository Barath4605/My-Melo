
export const albumState = {
    id: null,
    data: {},

    load(id) {
        const store = JSON.parse(localStorage.getItem("albumData") || "{}");
        this.data.id = id;
        this.data = store[id] || {
            cover: null,
            rating: 0,
            isFav: false,
            inQueue: false,
            review: "",

            name:"",
            artist:"",
            year:""
        };
    },

    save() {
        const store = JSON.parse(localStorage.getItem("albumData") || "{}");
        store[this.id] = this.data;

        localStorage.setItem("albumData", JSON.stringify(store));
    }
}