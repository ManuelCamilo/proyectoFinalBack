import express from 'express';
import routerProducts from './routers/router.products.js';
import routerCart from './routers/router.cart.js';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import routerViews from './routers/router.views.js'


const app = express()
const server = app.listen(8080, () => console.log('Server Up'));
const io = new Server(server) 

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// static
app.use(express.static(__dirname+'/public'))
 
//motor de plantillas - din
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars') 

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCart);
app.use('/realtimeproducts', routerViews);

io.on('connection', () => {
    console.log('cliente socket conectado')
})