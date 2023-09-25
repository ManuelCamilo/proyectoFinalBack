import express from 'express';
import routerProducts from './routers/router.products.js';
import routerCart from './routers/router.cart.js';
import routerViews from './routers/router.views.js'
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import sessionRouter from './routers/router.session.js';
import session from 'express-session';
import initializePassport from './config/passport.config.js'
import passport from 'passport';
import MongoStore from 'connect-mongo';
import config from './config/config.js';
import errorHandler from './services/errors/error.js'
import loggerController from './controllers/loggerController.js'
import routerRecovery from './routers/router.recover.js'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'; 
import routerUser from './routers/router.user.js';
import Product from './model/products.model.js'
import productModel from './model/products.model.js';

const uri = config.uri

const app = express()
const port = config.port || 8080

const server = app.listen(port, () => console.log(`Server Up on port ${port}`));
const io = new Server(server) 

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentación proyecto final Coderhouse\nProgramación Backend',
      description: 'Increíble documentación sobre mi proyecto de programación Backend en Coderhouse'
    }
  },
  apis: ['./docs/**/*.yaml']
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname+'/public'))
 
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars') 

app.use(session({
  store: MongoStore.create({ 
    mongoUrl: uri,
    dbName: "ecommerce",
   }),
   secret: "C0d3r",
   resave: true,
   saveUninitialized: true 
}));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


app.use('/', routerViews);
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCart);
app.use('/api/session', sessionRouter);
app.use('/api/recover-password', routerRecovery);
app.use('/api/users', routerUser)
app.get('/loggerTest',loggerController.testLogger);
app.use(errorHandler)

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado!");

  socket.on('deleteProd', async (prodId) => {
    console.log('Evento "deleteProd" recibido con ID: ', prodId);
    try {
      // Realiza la lógica para eliminar el producto con el ID "prodId"
      const deletedProduct = await productModel.findByIdAndDelete(prodId);
      console.log('Producto eliminado:', deletedProduct); // Agregado para verificar si se eliminó el producto    
      if (!deletedProduct) {
        // Si el producto no se encontró, emite un evento de error
        socket.emit('error', { error: 'El producto no se pudo encontrar o eliminar.' });
      } else {
        // Si el producto se eliminó correctamente, emite un evento "products" a todos los clientes
        const updatedProducts = await productModel.find();
        io.emit('products', updatedProducts);
        // Emite un evento de resultado exitoso
        socket.emit('result', 'Producto eliminado exitosamente.');
      }
    } catch (error) {
      // Manejo de errores
      console.error('Error al eliminar el producto:', error);
      socket.emit('error', { error: 'Ocurrió un error al eliminar el producto.' });
    }
  });
  
  // Manejo de eventos "addProd"
  socket.on('addProd', async (product) => {
    console.log('Evento "addProd" recibido con datos: ', product);
    try {
      // Realiza la lógica para agregar un nuevo producto utilizando los datos proporcionados en "product"
      const newProduct = new productModel({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        thumbnails: product.thumbnails,
        status: product.status,
        code: product.code,
        stock: product.stock
      });
       // Asegúrate de que los datos coincidan con tu modelo
      console.log('Nuevo producto a agregar:', newProduct);
      const savedProduct = await newProduct.save();
      console.log('Producto guardado:', savedProduct);
      if (!savedProduct) {
        // Si no se pudo guardar el producto, emite un evento de error
        socket.emit('error', { error: 'El producto no se pudo agregar.' });
      } else {
        // Si el producto se agregó correctamente, emite un evento "products" a todos los clientes
        const updatedProducts = await productModel.find();
        io.emit('products', updatedProducts);
        // Emite un evento de resultado exitoso
        socket.emit('result', 'Producto agregado exitosamente.');
      }
    } catch (error) {
      // Manejo de errores
      console.error('Error al agregar el producto:', error);
      socket.emit('error', { error: 'Ocurrió un error al agregar el producto.' });
    }
  });
});
      

mongoose.set('strictQuery', false)

try { 
  await mongoose.connect(uri)
  console.log('DB conectada')
  
} catch (err) {
  console.log('No se pudo conectar a la BD')
}

export default app