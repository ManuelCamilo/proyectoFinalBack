import express from "express";
import productModel from "../model/products.model.js";
import ProductManager from "../helpers/productManager.js";

const router = express.Router()

const productManager = new ProductManager()


router.get("/", async (request, response) => {
  const products = await productModel.find().lean().exec()
  console.log(products) 
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
    
        // const paginationOptions = {
        //   page: parseInt(page),
        //   limit: parseInt(limit),
        //   sort: sortValue !== 0 ? { price: sortValue } : undefined,
        // };
    
        const result = await productModel.paginate(queryFilter, {
            page:parseInt(page),
            limit: parseInt(limit),
            sort: sortValue !== 0 ? { price: sortValue } : undefined,
            lean:true
        });
        const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = result;
    
        const productsResult = {
          status: "success",
          products: docs,
          totalPages: totalPages,
          prevPage: prevPage,
          nextPage: nextPage,
          page: page,
          hasPrevPage: hasPrevPage,
          hasNextPage: hasNextPage,
          prevLink: hasPrevPage ? `/api/products?page=${prevPage}&limit=${limit}&sort=${sort}` : null,
          nextLink: hasNextPage ? `/api/products?page=${nextPage}&limit=${limit}&sort=${sort}` : null,
        };
    
        response.render("productList", {productsResult});
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        response.status(500).send("Error interno del servidor");
      }
    });

export default router