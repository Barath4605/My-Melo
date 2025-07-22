document.addEventListener("DOMContentLoaded", () => {
    
    const dialog = document.getElementById("dialogFullReview");
    const closeDialog = document.getElementById("dialogClose");

    window.showFullReview = () => {
        dialog.showModal();
    };

    window.closeFullReview = () => {
        dialog.close();
    }
    
    
});
