import log from "console";
import fs from "fs";
import crypto from "crypto";
import json from "stream/consumers";

let pathFile = "./src/data/fs/products.JSON";
/* Creo la clase */

class ProductManager {
  constructor() {
    this.products = [];
  }

  /* Metodos */
  /*Metodo agregar productos al array y creacion del JSON*/
  async addProduct(title, description, price, thumbnail, code, stock) {
    const id = this.products.length + 1;

    const newProducts = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    /* Validacion de datos */
    if (Object.values(newProducts).includes(undefined)) {
      return console.log(`Los datos del producto estan incompletos`);
    } else {
      /* Validacion del campo "Code" */
      const codeExists = this.products.filter(
        (codeExists) => codeExists.code === code
      );

      if (codeExists == false) {
        this.products.push(newProducts); //Pusheo al array los productos

        await fs.promises.writeFile(pathFile, JSON.stringify(this.products)); //Agrego al JSON los productos
      } else {
        //
        console.log(`El codigo del producto "${newProducts.code}" ya existe`);
        return;
      }
    }
  }

  /* Muestro todos los productos */
  async getProducts(id) {
    let productJson = await fs.promises.readFile(pathFile, "utf8"); //Leo el archivo
    productJson = JSON.parse(productJson); //Transformo el .JSON de string a objt

    id && (productJson = productJson.filter((ProductId) => ProductId.id <= id)); //se muestra todos los productos hasta al ID pasado por parametro

    return productJson;
  }

  /* Metodo buscar producto por ID */
  async getProductById(id) {
    const productJson = await fs.promises.readFile(pathFile, "utf8"); //Leo el archivo
    this.products = JSON.parse(productJson); //Transformo el .JSON de string a objt

    const IdExists = this.products.filter((ProductId) => ProductId.id === id);
    if (IdExists) {
      return this.products[id - 1];
    } else {
      return console.log("No existe el producto con este ID");
    }
  }

  //Metodo modificar producto por ID

  async updateProduct(id, fieldData) {
    const productJson = await fs.promises.readFile(pathFile, "utf8"); //Leo el archivo
    this.products = JSON.parse(productJson); //Transformo el .JSON de string a objt
    const index = this.products.findIndex((prod) => prod.id === id); //busco el id del objeto pasado por parametro

    this.products[index] = { ...this.products[index], ...fieldData }; //Creo una copia de mi objeto modificando los campos pasados por parametro
    await fs.promises.writeFile(pathFile, JSON.stringify(this.products)); //Sobreescribo el archivo
  }

  //Metodo Eliminar producto

  async deleteProduct(id) {
    const productJson = await fs.promises.readFile(pathFile, "utf8"); //Leo el archivo
    this.products = JSON.parse(productJson); //Transformo el .JSON de string a objt
    const filterId = this.products.filter((product) => product.id !== id); //Aplico metodo filter para que me devueva el array sin el producto pasando por parametro el ID

    await fs.promises.writeFile(pathFile, JSON.stringify(filterId)); //Sobreescribo el archivo
  }
}

//--------PRUEBAS--------//
const productManager = new ProductManager();
export default productManager;

// console.log(
//   Manager.addProduct("Telefono", "Samsung", "www.google.com", 20, "L01", 20)
// );
// console.log(
//   Manager.addProduct("Libro", "Historia", 10, "www.mercadolibre.com", "L02", 15)
// );
// console.log(
//   Manager.addProduct("Teclado", "Perifericos", 30, "www.google.com", "L03", 5)
// );

// /* Prueba para validacion de CODE no se  muestra  */
// console.log(
//   Manager.addProduct("Escuadra", "Matematica", 40, "www.facebook.com", "L03", 2)
// );c
// /* Muestro todos los productos */
// console.log(Manager.getProducts());
// /* Busco los productos por ID */
// console.log(Manager.getProductById(2));

// /*Modifico campo de un producto por ID */
// // console.log("Update Products");
// console.log(Manager.updateProduct(1, { title: "Movil", description: "Nokia" }));

// console.log(Manager.deleteProduct(2));
