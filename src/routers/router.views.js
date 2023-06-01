import express from "express";
import productModel from "../model/products.model.js";
import CartManager from "../helpers/cartManager.js";
import cartModel from "../model/carts.model.js";

const router = express.Router();

const cartManager = new CartManager();

router.get("/", async (request, response) => {
  const products = await productModel.find().lean().exec()
  response.render('index', { products })
  });

router.get("/realtimeProducts", (request, response) => {
    response.render("realTimeProducts", {});
});

router.get("/products", async (request, response) => {
    try {
        const { limit = 10, page = 1, sort, query, filter } = request.query;
    
        let sortValue = 0;
        if (sort === "desc") {
          sortValue = -1;
        } else if (sort === "asc") {
          sortValue = 1;
        }
    
        const queryFilter = {};
        if (query === "title") {
          queryFilter.title = filter;
        } else if (query === "category") {
          queryFilter.category = filter;
        }
    
        const result = await productModel.paginate(queryFilter, {
            page:parseInt(page),
            limit: parseInt(limit),
            sort: sortValue !== 0 ? { price: sortValue } : undefined,
            lean:true
        });
        const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = result;
    
        const prevLinkQuery = query ? `query=${query}&filter=${filter}` : ''; // Genera la cadena de consulta para prevLink
        const nextLinkQuery = query ? `query=${query}&filter=${filter}` : ''; // Genera la cadena de consulta para nextLink

        const productsResult = {
          status: "success",
          products: docs,
          totalPages: totalPages,
          prevPage: prevPage,
          nextPage: nextPage,
          page: page,
          hasPrevPage: hasPrevPage,
          hasNextPage: hasNextPage,
          prevLink: hasPrevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${sort}&${prevLinkQuery}` : '',
          nextLink: hasNextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${sort}&${nextLinkQuery}` : '',
        };

        response.render("productList", {productsResult});
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        response.status(500).send("Error interno del servidor");
      }
    });

router.get("/carts/:cid", async (request, response) => {
  const cid = request.params.cid
  try {
    const cart = await cartModel.findOne({ _id:cid }).lean();

    response.render("cart", {cart});
  } catch (error) {
    console.error("No se pudo obtener el carrito: ", error);
    response.status(500).send ("Error")
  }
  
})



export default router