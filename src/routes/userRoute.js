import express from 'express'
import { authenticated, createUser, getAllUsers, userLogIn } from '../methods/userMethod.js'
import { requireToken } from '../middlewares/index.js'

const router = express.Router()

router
    .get('/', getAllUsers)
    .get('/auth', requireToken, authenticated)
    .post('/login', userLogIn)
    .post('/', createUser)

export const USER_ROUTER = {
    router
}