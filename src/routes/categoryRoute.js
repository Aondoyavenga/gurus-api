import express from 'express'
import { getAllCategory, createCategory } from '../methods/categoryMethod.js'
const router = express.Router()

router
    .get('/', getAllCategory)
    .post('/', createCategory)


export const CATEGORY_ROUTER = {
    router
}