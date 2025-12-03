/* ============================= Varibales ============================= */
const url = "http://localhost:3000/api/products";


let catalogo = document.querySelector("#catalogo");
let barraBusqueda = document.querySelector("#barra-busqueda");
let headerImg = document.querySelector("#header-img");
let contadorCarrito = document.querySelector("#contador-carrito");
let headerCart = document.querySelector("#header-cart-icon")
let filterCasco = document.querySelector("#filter-button-casco");
let filterRemera = document.querySelector("#filter-button-remera");

// Carrusel equipos ---------- ----------
let ferrariIcon = document.querySelector("#icon-ferrari");
let aplineIcon = document.querySelector("#icon-apline");
let mercedesIcon = document.querySelector("#icon-mercedes");
let rbIcon = document.querySelector("#icon-rb");
let asmartinIcon = document.querySelector("#icon-asmartin");
let kickIcon = document.querySelector("#icon-kick");
let haasIcon = document.querySelector("#icon-mclaren");
let mclarenIconIcon = document.querySelector("#icon-mclaren");
let williamsIcon = document.querySelector("#icon-williams");
let rbcashIcon = document.querySelector("#icon-rbcash");

ferrariIcon.addEventListener("click", () => filtrarProductosPorEquipo("Ferrari"));
aplineIcon.addEventListener("click", () => filtrarProductosPorEquipo("Alpine"));
mercedesIcon.addEventListener("click", () => filtrarProductosPorEquipo("Mercedes"));
rbIcon.addEventListener("click", () => filtrarProductosPorEquipo("Red Bull"));
asmartinIcon.addEventListener("click", () => filtrarProductosPorEquipo("Aston Martin"));
haasIcon.addEventListener("click", () => filtrarProductosPorEquipo("Haas"));
mclarenIconIcon.addEventListener("click", () => filtrarProductosPorEquipo("Mclaren"));
kickIcon.addEventListener("click", () => filtrarProductosPorEquipo("Sauber"));
williamsIcon.addEventListener("click", () => filtrarProductosPorEquipo("Williams"));
rbcashIcon.addEventListener("click", () => filtrarProductosPorEquipo("VCARB"));
// ---------- ---------- ---------- ----------

// Session Storage
if(sessionStorage.getItem("userData")){ // User data
    let userData = JSON.parse(sessionStorage.getItem("userData"));
    console.log(userData.nombreUsuario);
}else{
    window.location = "login.html";
}
if(sessionStorage.getItem("carrito")){
    actualizarCarritoIcon();
}



barraBusqueda.addEventListener("keyup", filtrarProductos);
headerImg.addEventListener("click", obtenerDatos);
headerCart.addEventListener("click", () => window.location = "carrito.html");
filterCasco.addEventListener("click", () => filtrarProductosPorCategoria("CASCO"));
filterRemera.addEventListener("click", () => filtrarProductosPorCategoria("REMERA"));


/* ============================= Funciones ============================= */
// Consumir JSON para los productos.
async function obtenerDatos(filtrar, equipo, categoria){ // Las funciones async siempre devuelven una promesa, independientemente del valor de lo que retorna.

    try {
        let respuesta = await fetch(url); // Hacemos una peticion a nuestro nuevo endpoint en http://localhost:3000/products

        let data = await respuesta.json();

        let productos = data.payload; // Nuestros productos estan disponibles dentro de payload { payload: Array(19) }

        if(filtrar && equipo === null && categoria === null){
            let productosFiltrados = productos.filter((producto) => producto.NOMBRE.toLowerCase().includes(barraBusqueda.value.toLowerCase()));
            return productosFiltrados;
        }else if(filtrar && equipo){
            let productosFiltrados = productos.filter((producto) => producto.NOMBRE.toLowerCase().includes(equipo.toLowerCase()));
            return productosFiltrados;
        }else if(filtrar && categoria){
            let productosFiltrados = productos.filter((producto) => producto.TIPO.toLowerCase() === categoria.toLowerCase());
            return productosFiltrados;
        }else{
            mostrarProductos(productos);
        }

    } catch(error) {
            console.error(error);
    }
}

async function filtrarProductosPorCategoria(categoria){
    console.log(categoria);
    let productosFiltrados = await obtenerDatos(true, null, categoria);
    mostrarProductos(productosFiltrados);
}

async function filtrarProductosPorEquipo(equipo){
    console.log(equipo);
    let productosFiltrados = await obtenerDatos(true, equipo, null);
    mostrarProductos(productosFiltrados);
}

async function filtrarProductos(){  
    let productosFiltrados = await obtenerDatos(true, null, null);
    mostrarProductos(productosFiltrados);
}

function mostrarProductos(arrayProductos){
    
    //console.table(arrayProductos); // Recibimos correctamente en formato tabla los productos que nos manda la funcion obtenerProductos()
    let htmlProducto = "";
    arrayProductos.forEach(producto => {
        console.log(producto.IMG_URL);
        htmlProducto += `
            <div class="card-producto">
                <img src="http://localhost:3000/${producto.IMG_URL}" alt="${producto.NOMBRE}">
                <h5>${producto.NOMBRE}</h5>
                <div class = "product-data-container"> 
                    <p><strong>$${producto.PRECIO}</strong></p>
                    <div class="cart-controllers">
                        <div class="cart-controllers-buttons"> 
                            <button onclick='agregarProductoCarrito("${producto.IMG_URL}", "${producto.NOMBRE}", ${producto.ID}, ${producto.PRECIO})'> + </button>
                            <button onclick='eliminarProductoCarrito(${producto.ID})'> - </button>
                        </div>
                        <p id="product-counter-${producto.ID}" class="product-counter">${obtenerCantidadProducto(producto.ID) != 0 ?  obtenerCantidadProducto(producto.ID) : ""}</p>
                    </div>
                </div>
            </div>
        `;
    });
       
    catalogo.innerHTML = htmlProducto;
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
    actualizarCarritoIcon();
    actualizarContadorProducto(idProducto);
}

function eliminarProductoCarrito(idProducto){
    let carritoActual = sessionStorage.getItem("carrito");
    if(carritoActual){
        let carrito = JSON.parse(carritoActual);
        let indice = carrito.findIndex(producto => producto.id === idProducto);
        if(indice != -1){
            carrito.splice(indice, 1);
        }
        actualizarSSCarrito(carrito);
        actualizarCarritoIcon();
        actualizarContadorProducto(idProducto);
    }
}

function actualizarCarritoIcon(){
    let arr = JSON.parse(sessionStorage.getItem("carrito"));
    if(arr.length != 0){
        contadorCarrito.innerHTML = `${arr.length}`;
        document.getElementById("contador-carrito").style.backgroundColor = "#e00700";
    }else{
        contadorCarrito.innerHTML = "";
        document.getElementById("contador-carrito").style.backgroundColor = "white";
    }
}

function actualizarContadorProducto(idProducto){
    let productCounter = document.querySelector(`#product-counter-${idProducto}`);
    if(obtenerCantidadProducto(idProducto) === 0){
        productCounter.innerHTML = "";
    }else{
        productCounter.innerHTML = obtenerCantidadProducto(idProducto);
    }
}

function actualizarSSCarrito(arrayCarrito){
    let jsonCarrito = JSON.stringify(arrayCarrito);
    sessionStorage.setItem("carrito", jsonCarrito);
}

function obtenerCantidadProducto(idProducto){
    if(sessionStorage.getItem("carrito")){
        let carrito = JSON.parse(sessionStorage.getItem("carrito"));
        let contador = 0;
        carrito.forEach(producto => {
            if(producto.id === idProducto){
                contador++;
            }
        })
        return contador;
    }else{
        return 0;
    }
}

function init(){
    obtenerDatos(false);
}




/* ============================= Llamadas ============================= */
init();


