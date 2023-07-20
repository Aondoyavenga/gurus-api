import cors from 'cors'
import env from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { CATEGORY_ROUTER } from './src/routes/categoryRoute.js'
import { CUSTOMER_ROUTER } from './src/routes/customerRoute.js'
import { ORDER_ROUTER } from './src/routes/orderRoute.js'
import { PRODUCT_ROUTER } from './src/routes/productRoute.js'
import { SUBCATEGORY_ROUTER } from './src/routes/subcategory.js'
import {USER_ROUTER} from './src/routes/userRoute.js'
import path from 'path'
import { requireToken } from './src/middlewares/index.js'
import { STORE_ROUTER } from './src/routes/storeRoute.js'
import { databaseConnection } from './src/global/connection.js'

const appServer = async () => {
    const app = express()
    env.config()
    app.use(cors())
    app.use(express.json())



    const __dirname = path.resolve()
    const PORT = process.env.PORT
    const staticDir = path.join(__dirname +'/public/static')

    await databaseConnection()

    app.listen(PORT, () =>{
        console.log(`API listening on PORT ${PORT} `)    
    })

    app.use(express.static(path.join(__dirname, 'out')));

    app.use('/api/v1/user', USER_ROUTER.router)
    app.use('/api/v1/store', STORE_ROUTER.router)
    app.use('/api/v1/orders', requireToken, ORDER_ROUTER.router)
    app.use('/api/v1/product', requireToken, PRODUCT_ROUTER.router)
    app.use('/api/v1/customer', CUSTOMER_ROUTER.router)
    app.use('/api/v1/category', requireToken, CATEGORY_ROUTER.router)
    app.use('/api/v1/subcategory', SUBCATEGORY_ROUTER.router)

    app.use('/public/static', express.static(staticDir));

    // app.get('*', (req, res) =>{
    //     res.sendFile(path.resolve(__dirname, './out', 'index.html'))
    // })

    
}

appServer()




