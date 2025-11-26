/* ============================= Varibales ============================= */
let formularioLogin = document.getElementById("login-form");



/* ============================= Funciones ============================= */
formularioLogin.addEventListener("submit", (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);
    let userData = Object.fromEntries(formData.entries());
    let userDataJson = JSON.stringify(userData);

    sessionStorage.setItem("userData", userDataJson);

    window.location = "index.html";
});
