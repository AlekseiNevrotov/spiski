const modal = document.getElementById("modal");
const btn = document.querySelector(".btn");
const span = document.getElementById("closeModal");
btn.onclick = function() {
    modal.classList.add("show");
}
span.onclick = function() {
    modal.classList.remove("show");
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.classList.remove("show");
    }
}