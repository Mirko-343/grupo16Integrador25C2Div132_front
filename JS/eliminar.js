/* ============================= Varibales ============================= */
let getProductsForm = document.getElementById("get-products-form");
let listadoProductos = document.getElementById("listado-productos");



/* ============================= Funciones ============================= */
getProductsForm.addEventListener("submit", async event => {
    event.preventDefault();

    let formData = new FormData(event.target);

    let data = Object.fromEntries(formData.entries());

    let idProducto = data.id;

    try{

        let response = await fetch(`http://localhost:3000/api/products/${idProducto}`);

        let datos = await response.json();

        let producto = datos.payload[0];

        mostrarProducto(producto);

    }catch(error){
        console.error("Error al intentar consutlar producto: ", error);
    }
});


function mostrarProducto(producto){
    let htmlProducto = `
            <li class="li-listados">
            <img src="${producto.IMG_URL}" alt="${producto.NOMBRE}" class="img-li-listados">
            <p>ID: ${producto.ID} / Nombre: ${producto.NOMBRE} / <strong>Precio: $${producto.PRECIO}</strong></p>
            </li>
            <li class="li-botonera">
                <input type="button" id="delete-product-button" value="Eliminar producto">
            </li>
        `

    listadoProductos.innerHTML = htmlProducto;

    let deleteProductButton = document.getElementById("delete-product-button");

    deleteProductButton.addEventListener("click", event =>{
        event.stopPropagation(); 
        let confirmacion = confirm("¿Estás seguro de que deseas eliminar el producto?"); 

        if(!confirmacion){
            alert("Eliminación de producto cancelada");
        }else{
            eliminarProducto(producto.ID);
        }
    })
}


async function eliminarProducto(idProducto){
    let url = "http://localhost:3000/api/products";
    try{
        console.log(`Haciendo peticion DELETE a ${url}/${idProducto}`);

        let response = await fetch(`${url}/${idProducto}`,{
            method : "DELETE"
        });

        let result = await response.json(); 

        if(response.ok) {
            alert(result.message);
            console.log(result.message);

            listadoProductos.innerHTML = "";

        } else {
            alert("No se pudo eliminar un producto");
            console.error(result.message);
        }

    }catch(error){
        console.error("Error en la solicitud DELETE: ", error);
        alert("Ocurrio un error al intentar eliminar un producto");
    }
}