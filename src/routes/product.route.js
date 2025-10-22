import { Router } from "express";
import { allProducts, createProduct, deleteProduct, singleProduct, updateProduct } from "../controller/product.controller.js";

const productRouter=Router()

productRouter.get("/products",allProducts)
productRouter.get("/products/:productId",singleProduct)
productRouter.post("/products",createProduct)
productRouter.put("/products/:productId",updateProduct)
productRouter.delete("/products/:productId",deleteProduct)

export default productRouter
