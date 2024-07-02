function toggleLoginModal() {
    var loginModal = document.getElementById("loginModal");
    loginModal.style.display = (loginModal.style.display === "block") ? "none" : "block";
}

function toggleRegisterModal() {
    var registerModal = document.getElementById("registerModal");
    registerModal.style.display = (registerModal.style.display === "block") ? "none" : "block";
}

function closeLoginModal() {
    var loginModal = document.getElementById("loginModal");
    loginModal.style.display = "none";
}

function closeRegisterModal() {
    var registerModal = document.getElementById("registerModal");
    registerModal.style.display = "none";
}
