/* ============================= Varibales ============================= */
const url = "http://localhost:3000/products"

let catalogo = document.querySelector("#catalogo");
let barraBusqueda = document.querySelector("#barra-busqueda");

barraBusqueda.addEventListener("keyup", filtrarProductos);

/* ============================= Funciones ============================= */
// Consumir JSON para los productos.
async function obtenerDatos(filtrar){ // Las funciones async siempre devuelven una promesa, independientemente del valor de lo que retorna.

    try {
        let respuesta = await fetch(url); // Hacemos una peticion a nuestro nuevo endpoint en http://localhost:3000/products

        let data = await respuesta.json();

        let productos = data.payload; // Nuestros productos estan disponibles dentro de payload { payload: Array(19) }

        if(filtrar){
            let productosFiltrados = productos.filter((producto) => producto.NOMBRE.toLowerCase().includes(barraBusqueda.value.toLowerCase()));
            return productosFiltrados;
        }else{
            mostrarProductos(productos);
        }

    } catch(error) {
            console.error(error);
    }
}

async function filtrarProductos(){
    let productosFiltrados = await obtenerDatos(true);
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
                <p>Id: ${producto.ID}</p>
                <p>$${producto.PRECIO}</p>
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