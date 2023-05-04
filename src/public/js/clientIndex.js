const socket = io();

socket.on("products", (products) => {
    console.log(products);
    // aquí puedes actualizar la lista de productos en la página con los datos recibidos
  });
  
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const code = document.getElementById("code").value;
  
    socket.emit("addProduct", {
      title,
      description,
      thumbnail,
      price,
      stock,
      code,
    });
  });