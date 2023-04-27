
import express from 'express';
import routerProducts from './src/routers/router.products.js';
import routerCart from './src/routers/router.cart.js';

const server = express()

server.use(express.json());


server.use('/api/products', routerProducts);
server.use('/api/carts', routerCart);

server.listen(8080, () => console.log('Server Up'));



