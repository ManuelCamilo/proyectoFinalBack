
import express from 'express';
import routerProducts from './src/routers/router.products.js';


const server = express()

server.use(express.json());


server.use('/api/products', routerProducts);


server.listen(8080, () => console.log('Server Up'));



