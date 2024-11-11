import express from 'express';
import routerProducts from './routes/product.router.js';
import routerCarts from './routes/cart.router.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/public', express.static('./src/public'));
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});