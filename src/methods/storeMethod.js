import { Store } from "../models/Store.js"

export const getStores = async (req, res) => {
    try {
        const stores = await Store.find({status: {$ne: 'Deleted'}}).select({__v: 0, updatedAt: 0})
        
        res.status(200).json(stores)
    } catch (error) {
        res.status(404).send({message: `${error.message} Internal Server Error`})
    }
}

export const createStore = async (req, res) => {
    try {
        const {name} = req.body
        const store = new Store({name})

        await store.save()

        res.status(201).send({message: `${name} created`})
    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}