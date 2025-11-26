/* ============================= Varibales ============================= */
let carritoContainer = document.querySelector("#carrito-container");
const url = "http://localhost:3000/api/products";



/* ============================= Funciones ============================= */
function mostrarCarrito(carrito){
    if(carrito){
        let acumuladorPrecio = 0;
        let htmlProducto = `<ul>`
        carrito.forEach(producto => {
            htmlProducto += `
                <li> 
                    Nombre: ${producto.nombre} || Precio : ${producto.precio}
                    <button> </button>
                </li>
            `
            acumuladorPrecio += producto.precio
        })
        htmlProducto += `</ul>
                         <div class="carrito-footer">
                         <p> Total: ${acumuladorPrecio} </p>
                         <button onclick='vaciarCarrito()'>Vaciar carrito</button>
                         </div>`
        carritoContainer.innerHTML += htmlProducto;
    }else{
        carritoContainer.innerHTML = "";
    }
}

function obtenerProductos(){
    if(sessionStorage.getItem("carrito")){
        let carrito = JSON.parse(sessionStorage.getItem("carrito"));
        return carrito;
    }
}

function vaciarCarrito(){
    sessionStorage.removeItem("carrito");
    mostrarCarrito(obtenerProductos());
}

function init(){
    mostrarCarrito(obtenerProductos());
}



/* ============================= Llamadas ============================= */
init();