import express from 'express';
import routerProducts from './routers/router.products.js';
import routerCart from './routers/router.cart.js';
import __dirname from './utils.js';
import handlebars from 'express-handlebars'

const server = express()

server.use(express.json());
 
// static
server.use(express.static(__dirname+'/public'))

//motor de plantillas - din
server.engine('handlebars', handlebars.engine())
server.set('views', __dirname+'/views')
server.set('view engine', 'handlebars') 

server.use('/api/products', routerProducts);
server.use('/api/carts', routerCart);

server.listen(8080, () => console.log('Server Up'));

