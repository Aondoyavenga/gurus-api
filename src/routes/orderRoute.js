import express from 'express'
import { getAllOrders, placeOrder, getOrderItems, removeOrderItem, 
    getCustomerOrders, getAllOrderItems, getSalesOrders, getPurchasesOrders, 
    getOrderByStatus, removeOrder, closeSalesOrders, handleCloseSales, getClosedSalesPeriodic, 
    getOrderItemsByDate_Product } from '../methods/orderMethod.js'
const router = express.Router()

router
    .get('/', getAllOrders)
    .get('/date', getAllOrders)

    .get('/:orderId', getCustomerOrders)
    .get('/items/:orderId', getOrderItems)
    .get('/list/all', getAllOrderItems)
    .get('/ordertype/sales', getSalesOrders)
    .get('/ordertype/purchase', getPurchasesOrders)
    .get('/orderstatus/:status', getOrderByStatus)
    .get('/close/sales', closeSalesOrders)
    .get('/close/date/:startDate/:endDate', getClosedSalesPeriodic)
    .get('/sold/date_product/:from/:to/:product', getOrderItemsByDate_Product)


    .post('/', placeOrder)
    .post('/close/sales', handleCloseSales)

    .delete('/:orderId', removeOrder)
    .delete('/row/:orderRow', removeOrderItem)

export const ORDER_ROUTER = {
    router
}