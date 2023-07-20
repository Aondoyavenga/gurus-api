import express from 'express'
import { getStores, createStore }  from '../methods/storeMethod.js'

const router = express.Router()

router
    .get('/', getStores)
    .post('/', createStore)

export const STORE_ROUTER = {
    router
}