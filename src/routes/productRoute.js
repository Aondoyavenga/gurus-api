import express from 'express'
import { getAllProducts, getSearchData, createProduct, getProductOrderList, getAllProductsPagenet, priceControl, findSelectedProducts, getProductStockDue } from '../methods/productMethod.js'

const router = express.Router()


router
    .get('/', getAllProducts)
    .post('/', createProduct)
    .post('/price', priceControl)
    .post('/selected', findSelectedProducts)
    .get('/search/:query', getSearchData)
    .get('/:page/:limit', getAllProductsPagenet)
    .get('/dueproducts', getProductStockDue)
    .post('/order', getProductOrderList)

export const PRODUCT_ROUTER = {
    router
}