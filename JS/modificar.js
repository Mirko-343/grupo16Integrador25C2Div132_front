/* ============================= Varibales ============================= */
let getProductsForm = document.getElementById("get-products-form");
let listadoProductos = document.getElementById("listado-productos");
let contenedorFormulario = document.getElementById("contenedor-formulario");


/* ============================= Funciones ============================= */
getProductsForm.addEventListener("submit", async (event) =>{ // Cuando hago click en el botón para buscar producto
    event.preventDefault();

    // Creo un nuevo objeto tipo FormData a partir de los datos del formulario. (Objeto con pares clave-valor)
    let formData = new FormData(event.target);

    // Transformo el objeto FormData a un objeto normal de JavaScript
    let data = Object.fromEntries(formData);

    // Del objeto JavaScript extarigo el ID
    let idProducto = data.id;

    try{
        let url = `http://localhost:3000/api/products/${idProducto}`;
        
        console.log(`Realizando petición GET a ${url}`);
        
        let response = await fetch(url);

        let datos = await response.json();

        let producto = datos.payload[0];

        mostrarProducto(producto);
    }catch(error){
        console.error("Error intentando consultar producto", error);
    }
})

function mostrarProducto(producto){
    let htmlProducto = `
                    <li class="li-listados">
                    <img src="${producto.IMG_URL}" alt="${producto.NOMBRE}" class="img-li-listados">
                    <p>ID: ${producto.ID} / Nombre: ${producto.NOMBRE} / <strong>Precio: $${producto.PRECIO}</strong></p>
                    </li>
                    <li class="li-botonera">
                        <input type="button" id="update-product-button" value="Actualizar producto">
                    </li>
                `

    listadoProductos.innerHTML = htmlProducto;

    let updataProductButton = document.getElementById("update-product-button");

    updataProductButton.addEventListener("click", event =>{ // Le doy funcionalidad al botón para modificar producto
        crearFormularioPut(event, producto);
    })
}

function crearFormularioPut(event, producto){
    

    event.stopPropagation();

    let hmtlFormularioPut = `
                                <form method="post" id="update-products-form">
                                    <input type="hidden" name="id" value="${producto.ID}">

                                    <label for="nombreProd">Nombre</label>
                                    <input type="text" name="nombre" id="nombreProd" value="${producto.NOMBRE}" required> 

                                    <label for="imgProd">Iamgen</label>
                                    <input type="text" name="img_url" id="imgProd" value="${producto.IMG_URL}" required>

                                    <label for="tipoProd">Tipo</label>
                                    <select name="tipo" id="tipoProd" value="${producto.TIPO}" required>
                                        <option value="CASCO">casco</option>
                                        <option value="REMERA">remera</option>
                                    </select>

                                    <label for="precioProd">Precio</label>
                                    <input type="number" name="precio" id="precioProd" value="${producto.PRECIO}" required>

                                    <input type="hidden" name="activo" value="${producto.ACTIVO}">

                                    <input type="submit" value="Actualizar Producto">
                                </form>
                            `

    contenedorFormulario.innerHTML = hmtlFormularioPut;

    let updateProductsForm = document.getElementById("update-products-form");

    updateProductsForm.addEventListener("submit", event => { // Le doy funcionalidad el formulario
        actualizarProducto(event);
    });
}


async function actualizarProducto(event){
    event.preventDefault();

    let url = "http://localhost:3000/api/products";

    let formData = new FormData(event.target);

    let data = Object.fromEntries(formData.entries());

    try{
        let response = await fetch(url, {
            method : "PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data), // Convierto el objeto JS que creé a partir de los datos del formulario a JSON
        });

        let result = await response.json(); // Toma el cuerpo de la response y lo convierte en un objeto JS.

        if(response.ok){
            alert(result.message);
            listadoProductos.innerHTML = "";
            contenedorFormulario.innerHTML = "";
        }else{
            alert(result.message);
            console.error("Error el intentar modificar el producto");
        }

    }catch(error){
        console.error("Error al intentar actualizar producto: ", error);
    }
}