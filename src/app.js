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
// app.use('/realtimeproducts', routerViews);


// io.on("connection", (socket) => {
//     console.log("Nuevo cliente conectado!");

//     const productManager = new ProductManager()
  
//     productManager.getProducts().then((products) => {
//       if (products) {
//         io.emit("resp-new-product", products);
//       }
//     });
  
//     socket.on("new-product", (products) => {
//       productManager.addProduct(products).then((products) => {
//         if (products) {
//           productManager.getProductos().then((products) => {
//             if (products) {
//               io.emit("resp-new-product", products);
//             }
//           });
//         } else {
//           socket.emit("resp-new-product", "Error al agregar el producto");
//         }
//       });
//     });
  
//     socket.on('delete-product', (id) => {
//       productManager.deleteProduct(parseInt(id)).then((products) => {
//         if (products) {
//           productManager.getProductos().then((products) => {
//             if (products) {
//               io.emit("resp-delete-product", products);
//             }
//           });
//         } else {
//           socket.emit("resp-delete-product", "Error al eliminar el producto");
//         }
//       });
//     });
// });


mongoose.set('strictQuery', false)

try { 
  await mongoose.connect(uri)
  console.log('DB conectada')
  
} catch (err) {
  console.log('No se pudo conectar a la BD')
}

export default app