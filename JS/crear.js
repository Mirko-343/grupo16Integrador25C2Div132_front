/* ============================= Varibales ============================= */
let altaProductsForm = document.getElementById("alta-products-form");
let url = "http://localhost:3000/api/products";



/* ============================= Funciones ============================= */
altaProductsForm.addEventListener("submit", async event =>{ // Obtener datos cargados por el usuario en el form.
    event.preventDefault();

    console.log("Hola desde el eventListener");

    let formData = new FormData(event.target);

    let data = Object.fromEntries(formData.entries());

    cargarProducto(data); // Si bien los datos se pasan como objetos JS se van a terminar enviando como JSON
});

async function cargarProducto(data){
    console.table(data);

    try{
        let response = await fetch(url, {
            method : "POST",
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify(data)
        });
        
        let result = await response.json();

        if(response.ok){
            console.log(result.message);
            alert(result.message);
        }else{
            console.error("Problemas con respuesta recibida: ", result.message);
        }
    }catch(error){
        console.log("Error intentando cargar producto: ", error);
    }
}