/* ============================= Varibales ============================= */
let carritoContainer = document.querySelector("#carrito-container");
const url = "http://localhost:3000/api/products";



/* ============================= Funciones ============================= */
function mostrarCarrito(cantidades){
    if(cantidades){
        carritoContainer.innerHTML = "";
        let acumuladorPrecio = 0;
        let htmlProducto = `<ul class="cart-list">`
        for(const [producto, cantidad] of cantidades){
            //console.log(producto.nombre + " " + cantidad);
            htmlProducto += `
                <li class="cart-list-item"> 
                    Nombre: ${producto.nombre} || Precio : ${producto.precio} || ${cantidad}
                    <img class="cart-img" src="http://localhost:3000/${producto.img_url}">
                    <button onclick='agregarProductoCarrito("${producto.img_url}", "${producto.nombre}", ${producto.id}, ${producto.precio})'> + </button>
                    <button onclick='eliminarProductoCarrito(${producto.id})'> - </button>
                </li>
            `
            acumuladorPrecio += producto.precio * cantidad
        }
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

function contarProductosCarrito(carrito){
    cantidades = new Map();
    for(i = 0; i < carrito.length;){
        if(carrito.length != 0){
            let filtrados = carrito.filter(prod => prod.nombre === carrito[i].nombre);
            let restantes = carrito.filter(prod => prod.nombre != carrito[i].nombre);
            cantidades.set(carrito[i], filtrados.length);
            carrito = restantes;
        }
    }
    mostrarCarrito(cantidades);
}

function agregarProductoCarrito(imgProducto, nombreProducto, idProducto, precioProducto){
    let nuevoProducto = {
        id : idProducto,
        nombre : nombreProducto,
        img_url : imgProducto,
        precio : precioProducto
    }

    let carritoActual = sessionStorage.getItem("carrito");

    if(carritoActual){
        let carrito = JSON.parse(carritoActual);
        carrito.push(nuevoProducto);
        actualizarSSCarrito(carrito);
    }else{
        let arrayCarrito = [nuevoProducto];
        actualizarSSCarrito(arrayCarrito);
    }
    contarProductosCarrito(obtenerProductos());
}

function eliminarProductoCarrito(idProducto){
    let carritoActual = sessionStorage.getItem("carrito");
    if(carritoActual){
        let carrito = JSON.parse(carritoActual);
        carrito.forEach(prod => {
            console.log(prod.id + " " + idProducto);
            console.log(prod.id === idProducto);
        })
        let indice = carrito.findIndex(producto => producto.id === idProducto);
        console.log(indice);
        if(indice != -1){
            console.log("hola puto");
            carrito.splice(indice, 1);
        }
        actualizarSSCarrito(carrito);
        contarProductosCarrito(obtenerProductos());
    }
}

function actualizarSSCarrito(arrayCarrito){
    let jsonCarrito = JSON.stringify(arrayCarrito);
    sessionStorage.setItem("carrito", jsonCarrito);
}

function vaciarCarrito(){
    sessionStorage.removeItem("carrito");
    mostrarCarrito(obtenerProductos());
}

function init(){
    contarProductosCarrito(obtenerProductos());
}



/* ============================= Llamadas ============================= */
init();