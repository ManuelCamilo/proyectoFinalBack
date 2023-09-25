const socketClient = io();

// Asigno
const addform = document.querySelector("#addproduct");
addform.addEventListener("submit", (ev) => {
    ev.preventDefault();
    // emito un evento para agragar el producto
    const formData = new FormData(addform);
    const productData = {
        title: formData.get("title"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        category: formData.get("category"),
        thumbnails: formData.get("thumbnails"),
        status: formData.get("status"),
        code: formData.get("code"),
        stock: parseInt(formData.get("stock")),
    }
    console.log('Evento "submit" del formulario de agregar producto con datos:', productData); // Agregado para verificar los datos enviados
    socketClient.emit("addProd", productData);
});
// busco busco todos los botones para borrar el producto
document.addEventListener("click", (ev) => {
    if (ev.target.classList.contains("deleteproduct")) {
        ev.preventDefault();
        const prodid = ev.target.getAttribute("prodid");
        console.log('Botón "Borrar producto" con ID:', prodid);
        socketClient.emit("deleteProd", prodid);
    }
});

socketClient.on("products", (productos) => {
    let innerHtml = "";
    // creo el html para reemplazar los productos en realTimeProducts
    productos.forEach((producto) => {
        innerHtml += `
        <div id="product${producto.id}">
        <h3>${producto.title}</h3>
            <p>${producto.description}</p>
            <p>Precio: $${producto.price}</p>
            <p>Categoría: ${producto.category}</p>
            <p>Imagen: ${producto.thumbnails}</p>
            <p>Status: ${producto.status}</p>
            <p>Código: ${producto.code}</p>
            <p>Stock: ${producto.stock}</p>
            <input
                type="button"
                class="deleteproduct"
                prodid="${producto.id}"
                value="Borrar este producto"
            />
            </div>
            `;
    });
    console.log('Productos recibidos:', productos);
    document.querySelector("#realtimeproducts").innerHTML = innerHtml;    
});

socketClient.on("error", (errores) => {
    console.log('Evento "error" recibido con errores:', errores);
    let errorestxt = "ERROR\r";
    errores.errortxt.forEach((error) => {
        errorestxt += error + "\r";
    });
    alert(errorestxt);
});
socketClient.on("result", (resultado) => {
    console.log('Evento "result" recibido con resultado:', resultado);
    alert(resultado);
});