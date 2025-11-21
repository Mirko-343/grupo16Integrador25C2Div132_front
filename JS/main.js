/* ============================= Varibales ============================= */
const url = "http://localhost:3000/api/products";

let catalogo = document.querySelector("#catalogo");
let barraBusqueda = document.querySelector("#barra-busqueda");

let ferrariIcon = document.querySelector("#icon-ferrari");
let aplineIcon = document.querySelector("#icon-apline");
let mercedesIcon = document.querySelector("#icon-mercedes");
let rbIcon = document.querySelector("#icon-rb");
let asmartinIcon = document.querySelector("#icon-asmartin");
let haasIcon = document.querySelector("#icon-haas");
let kickIcon = document.querySelector("#icon-kick");
let williamsIcon = document.querySelector("#icon-williams");
let rbcashIcon = document.querySelector("#icon-rbcash");

let headerImg = document.querySelector("#header-img");



barraBusqueda.addEventListener("keyup", filtrarProductos);

ferrariIcon.addEventListener("click", () => filtrarProductosPorEquipo("Ferrari"));
aplineIcon.addEventListener("click", () => filtrarProductosPorEquipo("Alpine"));
mercedesIcon.addEventListener("click", () => filtrarProductosPorEquipo("Mercedes"));
rbIcon.addEventListener("click", () => filtrarProductosPorEquipo("Red Bull"));
asmartinIcon.addEventListener("click", () => filtrarProductosPorEquipo("Aston Martin"));
haasIcon.addEventListener("click", () => filtrarProductosPorEquipo("Haas"));
kickIcon.addEventListener("click", () => filtrarProductosPorEquipo("Sauber"));
williamsIcon.addEventListener("click", () => filtrarProductosPorEquipo("Williams"));
rbcashIcon.addEventListener("click", () => filtrarProductosPorEquipo("VCARB"));

headerImg.addEventListener("click", obtenerDatos);

/* ============================= Funciones ============================= */
// Consumir JSON para los productos.
async function obtenerDatos(filtrar, equipo){ // Las funciones async siempre devuelven una promesa, independientemente del valor de lo que retorna.

    try {
        let respuesta = await fetch(url); // Hacemos una peticion a nuestro nuevo endpoint en http://localhost:3000/products

        let data = await respuesta.json();

        let productos = data.payload; // Nuestros productos estan disponibles dentro de payload { payload: Array(19) }

        if(filtrar && equipo === null){
            let productosFiltrados = productos.filter((producto) => producto.NOMBRE.toLowerCase().includes(barraBusqueda.value.toLowerCase()));
            return productosFiltrados;
        }else if(filtrar && equipo){
            let productosFiltrados = productos.filter((producto) => producto.NOMBRE.toLowerCase().includes(equipo.toLowerCase()));
            return productosFiltrados;
        }else{
            mostrarProductos(productos);
        }

    } catch(error) {
            console.error(error);
    }
}

async function filtrarProductosPorEquipo(equipo){
    console.log(equipo);
    let productosFiltrados = await obtenerDatos(true, equipo);
    mostrarProductos(productosFiltrados, null);
}

async function filtrarProductos(){  
    let productosFiltrados = await obtenerDatos(true, null);
    mostrarProductos(productosFiltrados);
}

function mostrarProductos(arrayProductos){
    
    //console.table(arrayProductos); // Recibimos correctamente en formato tabla los productos que nos manda la funcion obtenerProductos()
    let htmlProducto = "";
    arrayProductos.forEach(producto => {
        htmlProducto += `
            <div class="card-producto">
                <img src="${producto.IMG_URL}" alt="${producto.NOMBRE}">
                <h5>${producto.NOMBRE}</h5>
                <div class = "product-data-container"> 
                    <p>Id: ${producto.ID}</p>
                    <p><strong>$${producto.PRECIO}</strong></p>
                    <div class="cart-img-container">
                        <img src="./IMG/cart_icon.jpg">
                    </div>
                </div>
            </div>
        `;
    });

    catalogo.innerHTML = htmlProducto;
}


function init(){
    obtenerDatos(false);
}




/* ============================= Llamadas ============================= */
init();




/* Ciclo de ejecución explicado 
    1. Se llama a init() > esta función llama a la función cargarDatos() 
    2. cargarDatos() En la línea 13 guarda en la variable dataArray el retorno de la función obtenerDatos(), se usa await porque tiene que esperar a que la función obtenerDatos() termine 
    de ejecutar todo lo que tiene dentro y como es una función asíncrona no se hace en el momento, por eso se espera.
        2.1. Dentro de la función obtenerDatos() se consume la información de la URL que le pasé a fetch. 
        2.2. Después se transforma ese JSON en un array de objetos JavaScript. Se usa await porque tengo que esperar a que termine de consumirse lo que tiene la URL 
    3. Una vez que finalizó la ejecución de obtenerDatos() y ya tengo el retorno (array de objetos JS) guardado en una variable, le paso dicho array a la función mostrarCatalogo()
    4. mostrarCatalogo() carga el HTML con la información de los productos. */