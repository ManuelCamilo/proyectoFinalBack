import express from 'express';
import routerProducts from './routers/router.products.js';
import routerCart from './routers/router.cart.js';
import routerViews from './routers/router.views.js'
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import ProductManager from './helpers/mongoDB/productManager.js';
import mongoose from 'mongoose';

const uri = 'mongodb+srv://manuelcamilo16:C0d3r@coder.7izbpeb.mongodb.net/ecommerce'
const app = express()


const server = app.listen(8080, () => console.log('Server Up'));
const io = new Server(server) 


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname+'/public'))
 
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars') 

app.use("/", routerViews);
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCart);
// app.use('/realtimeproducts', routerViews);


io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado!");

    const productManager = new ProductManager('./data/productos.json')
  
    productManager.getProducts().then((products) => {
      if (products) {
        io.emit("resp-new-product", products);
      }
    });
  
    socket.on("new-product", (products) => {
      productManager.addProduct(products).then((products) => {
        if (products) {
          productManager.getProductos().then((products) => {
            if (products) {
              io.emit("resp-new-product", products);
            }
          });
        } else {
          socket.emit("resp-new-product", "Error al agregar el producto");
        }
      });
    });
  
    socket.on('delete-product', (id) => {
      productManager.deleteProduct(parseInt(id)).then((products) => {
        if (products) {
          productManager.getProductos().then((products) => {
            if (products) {
              io.emit("resp-delete-product", products);
            }
          });
        } else {
          socket.emit("resp-delete-product", "Error al eliminar el producto");
        }
      });
    });
});


mongoose.set('strictQuery', false)

try { 
  await mongoose.connect(uri)
  console.log('DB conectada')
  
} catch (err) {
  console.log('No se pudo conectar a la BD')
}
