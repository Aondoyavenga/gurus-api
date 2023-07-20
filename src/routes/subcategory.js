import express from 'express'
import { createSubcategory, getAllSubcategory } from '../methods/subcategoryMethod.js'

const router = express.Router()

router
    .get('/', getAllSubcategory)
    .post('/', createSubcategory)

export const SUBCATEGORY_ROUTER = {
    router
}