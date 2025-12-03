/* ============================= Varibales ============================= */
let carritoContainer = document.querySelector("#carrito-container");
let ticketButton = document.querySelector("#ticket-button")
const url = "http://localhost:3000/api/products";
let userData;

if(sessionStorage.getItem("userData")){ // User data
    userData = JSON.parse(sessionStorage.getItem("userData"));
    console.log(userData.nombreUsuario);
}else{
    window.location = "login.html";
}

/* ============================= Funciones ============================= */
ticketButton.addEventListener("click", imprimirTicket);

async function imprimirTicket(){
    let idProductos = []; // Array donde se guardan los id de los productos en el carrito
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    // Definimos el margen superior
    let y = 20;

    // Definimos tamaño para el primer texto
    doc.setFontSize(18);

    // Escribimos el texto "Ticket compra" en la posición (10,10) del PDF
    doc.text("Ticket de compra", 20, y);

    // Aumentamos el espacio después del título
    y += 20;

    // Cambiamos el tamaño de la fuente para los productos del ticket
    doc.setFontSize(12);

    // Iteramos el carrito
    obtenerProductos().forEach(producto => {
        idProductos.push(producto.id); // Guardamos el id de cada producto en el array para después registrar la venta
        doc.text(`${producto.nombre} - $${producto.precio}`, 40, y); // Insertamos el texto por cada producto en el ticket
        y += 10; // Aumentamos la altura para evitar solapamientos
    })

    // Calcular total con reduce
    const precioTotal = obtenerProductos().reduce((total, producto) => total + parseInt(producto.precio), 0);
    
    // Separo el precio total de los productos
    y += 15;
    doc.text(`Total: $${precioTotal}` , 20, y);

    //Imprimimos el ticket de compra
    doc.save("ticket.pdf");

    // Llamado a registrar ventas y que haga la redirección fetch POST a api/sales
    registrarVenta(precioTotal, idProductos);
}

async function registrarVenta(precioTotal, idProductos){
    // Transformar la fecha a un formato que acepte la BD
    const fecha = new Date()
    .toLocaleString("sv-SE", { hour12: false })  
    .replace("T", " ");

    const data = {
        date : fecha, // Si en la BD genero este dato de manera automática no es necesario pasar esto
        total_price : precioTotal,
        user_name : userData.nombreUsuario, // PONER NOMBRE DE USUARIO DE LA SESSION STORAGE
        products : idProductos
    }

    let response = await fetch("http://localhost:3000/api/sales", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(data)
    });
    
    let result = await response.json();

    if(response.ok){
        alert(result.message);

        sessionStorage.removeItem("userData");
        sessionStorage.removeItem("carrito");
        window.location = "login.html";
    }else{
        alert(result.message);
    }

    //alert("Venta creada con éxito");
    
}

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