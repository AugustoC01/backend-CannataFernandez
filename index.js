const express = require('express');
const { Router } = express;

const app = express();
const router = Router();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

server.on('error', (error) => {
  `Error en el servidor ${error}`;
});

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));
app.use('/api/products', router);

//MOTOR DE PLANTILLA
app.set('view engine', 'pug');
app.set('views', './views');

// IMPORTACION DE LA CLASE CONTENEDOR
const Contenedor = require('./ManejoArchivos.js');
const products = new Contenedor('productos');

// IMPLEMENTACION DEL ROUTER
router.get('/', async (req, res) => {
  const productsData = await products.getAll();
  res.render('productsList.pug', { products: productsData, productsExist: true });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const productData = await products.getById(id);
    if (productData) {
      res.render('productView.pug', { prod: productData });
    }
  } catch (error) {
    if (TypeError) {
      res.render('productNotFound.pug', { errorMsg: 'Producto no encontrado' });
    } else {
      console.log(error);
    }
  }
});

router.post('/', async (req, res) => {
  const { body } = req;
  const newId = await products.getNewId();
  body.id = newId;
  body.price = parseFloat(body.price);
  await products.save(body);
  console.log(body);
  res.redirect('/form');
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  let productToUpdate = await products.getById(id);
  productToUpdate = { ...productToUpdate, ...body };
  await products.update(productToUpdate);
  res.redirect('/api/products');
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await products.deleteById(id);
  res.redirect('/api/products');
});

// RUTA DEL FORMULARIO DE CARGA
app.get('/form', (req, res) => {
  res.render('productForm.pug');
});

/* router.get('/random', async (req, res) => {
  let randomId = Math.floor(Math.random() * 10) + 1;
  const randomProduct = await products.getById(randomId);
  res.json(randomProduct);
}); */
