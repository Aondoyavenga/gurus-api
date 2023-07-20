import express from 'express'
import { getAllCustomers, createCustomer } from '../methods/customerMethod.js'
const router = express.Router()

router
    .get('/', getAllCustomers)
    .post('/', createCustomer)


export const CUSTOMER_ROUTER = {
    router
}