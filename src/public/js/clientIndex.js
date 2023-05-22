const btnCrear = document.querySelector("#btnCrear");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const price = document.querySelector("#price");
const thumbnail = document.querySelector("#thumbnail");
const code = document.querySelector("#code");
const stock = document.querySelector("#stock");

const btnDelete = document.querySelector("#btnDelete");
const id = document.querySelector("#id");

const historyProducts = document.querySelector("#historyProducts");

const socket = io();

btnCrear.addEventListener("click", () => {
  let product = {
    title: title.value,
    description: description.value,
    price: price.value,
    thumbnail: thumbnail.value,
    code: code.value,
    stock: stock.value,
  };
  socket.emit("new-product", product);
});

btnDelete.addEventListener("click", () => {
  socket.emit("delete-product", id.value);
});

socket.on("resp-new-product", (data) => {
  if (typeof data == "string") {
    alert(data);
    return;
  } else {
    historyProducts.innerHTML = "";
    data.reverse().forEach((product) => {
      historyProducts.innerHTML += `
            <div>
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>${product.price}</p>
                <p>${product.thumbnail}</p>
                <p>${product.code}</p>
                <p>${product.stock}</p>
            </div>
            `;
    });
  }
});

socket.on("resp-delete-product", (data) => {
  if (typeof data == "string") {
    alert(data);
    return;
  } else {
    historyProducts.innerHTML = "";
    data.reverse().forEach((product) => {
      historyProducts.innerHTML += `
            <div>
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>${product.price}</p>
                <p>${product.thumbnail}</p>
                <p>${product.code}</p>
                <p>${product.stock}</p>
            </div>
            `;
    });
  }
});
