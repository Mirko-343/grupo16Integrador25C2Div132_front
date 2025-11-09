/* ============================= Varibales ============================= */
let getProductsForm = document.getElementById("get-products-form");
let listadoProductos = document.getElementById("listado-productos"); // Listado donde se van a mostrar los resultados de la búsqueda




/* ============================= Funciones ============================= */
getProductsForm.addEventListener("submit", async(event) =>{ // Obtener datos cargados por el usuario en el form.
    event.preventDefault();

    let formData = new FormData(event.target);
    let data = Object.fromEntries(formData.entries());
    let idProducto = data.id;

    console.log("ID consultado: ", idProducto);

    try{
        let url = `http://localhost:3000/products/${idProducto}` // URL a la que voy a hacer el fetch para enviar la request

        let response = await fetch(url); // Petición get a la url. fetch por defecto utiliza el método get.

        let datos = await response.json();

        let producto = datos.payload[0]; // La primera posición del array payload está ocupada por el array con los datos que necesito

        mostrarProducto(producto);
    }catch(error){
        console.log("Error consultando producto por ID: ", error);
    }
});

function mostrarProducto(producto){
    console.table(producto);

    let htmlProducto = `
                    <li class="li-listados">
                    <img src="${producto.IMG_URL}" alt="${producto.NOMBRE}" class="img-li-listados">
                    <p>ID: ${producto.ID} / Nombre: ${producto.NOMBRE} / Precio: $${producto.PRECIO}</p>
                    </li>
                `

    listadoProductos.innerHTML = htmlProducto;
}