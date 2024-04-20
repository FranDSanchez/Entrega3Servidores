import express, { response } from "express";
import productManager from "./data/fs/productManager2.js";

//para crear una aplicacion/servidor de express
const app = express();
//para inicializar la app de rexpress necesito configurar:
const port = 8080;
const ready = console.log("server ready on port: " + port);

//para inicilizar el servidor
app.listen(port, ready);

//para configurar el servidor con determinadas funcionalidades
app.use(express.urlencoded({ extended: true })); //para leer queys y params

//para configurar solicitudes/peticiones

app.get("/", (req, res) => {
  try {
    const message = "Bienvenido";

    return res.json({ status: 200, response: message });
  } catch (error) {
    console.log(error);
    return res.json({ status: 500, response: error.message });
  }
});

app.get("/products", getProducts);

app.get("/products/:pid", getProductById);

//Muestro los productos
async function getProducts(req, res) {
  try {
    const { limit } = req.query; //realizo una consulta,
    const products = await productManager.getProducts(limit); //se muestra todos los productos hasta al ID pasado por parametro
    if (products) {
      return res.json({ status: 200, response: products, limit });
    }
    const error = new Error(`Error al cargar`);
    error.status = 404;
    throw error;
  } catch (error) {
    console.log(error);
    return res.json({
      status: error.status || 500,
      response: error.message || "Error al cargar",
    });
  }
}

//Muestro por ID
async function getProductById(req, res) {
  try {
    const { pid } = req.params;
    const productId = await productManager.getProductById(pid);

    //Valido si existe el ID
    if (productId) {
      return res.json({ status: 200, response: productId });
    }
    const error = new Error(`El producto con ID:| ${pid} | no existe`);
    error.status = 404;
    throw error;
  } catch (error) {
    console.log(error);
    return res.json({
      status: error.status || 500,
      response: error.message || "Error",
    });
  }
}
