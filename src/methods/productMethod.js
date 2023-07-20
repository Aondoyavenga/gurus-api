import { Product } from "../models/Product.js"
import { Subcategory } from "../models/Subcategory.js"

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({status: {$ne: 'Deleted'}}).select({__v: 0, updatedAt: 0})
        .populate('category', {__v: 0, updatedAt: 0, subCategory: 0})
        .populate('subCategory', {__v: 0, updatedAt: 0, productRef: 0})
        .sort({updatedAt: -1})
        res.status(200).json(products)
    } catch (error) {
        res.status(404).send({message: `${error.message} Internal Server Error`})
    }
}

export const findSelectedProducts = async (req, res) =>{
    try {
        const {selectedIds} = req.body
        if(!selectedIds?.length > 0) return res.status(501).send({message: 'No product selected'})
        const products = await Product.find().where('_id').in(selectedIds.map(_id => _id))
            .select({__v: 0, updatedAt: 0})
            .populate('category', {__v: 0, updatedAt: 0, subCategory: 0})
            .populate('subCategory', {__v: 0, updatedAt: 0, productRef: 0})
            .exec();
        res.send(products)
    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}

export const searchAllProducts = async (req, res) => {
    try {
        const {query} = req.params
        const products = await Product.find({$or: [
            {status: {$ne: 'Deleted'}}, 
            {SKU_UPC: {$regex: query}},
            {productName: {$regex: query}}]}).select({__v: 0, updatedAt: 0})
        .populate('category', {__v: 0, updatedAt: 0, subCategory: 0})
        .populate('subCategory', {__v: 0, updatedAt: 0, productRef: 0})
        .sort({updatedAt: -1})
        res.status(200).json(products)
    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}

export const getAllProductsPagenet = async (req, res) => {
    try {
        const { page, limit } = req.params
        const products = await Product.find({status: {$ne: 'Deleted'}})
        .limit(limit * 1)
        .skip((page  -1) *limit)
        .sort({updatedAt: -1})
        .populate('category', {__v: 0, updatedAt: 0, subCategory: 0})
        .populate('subCategory', {__v: 0, updatedAt: 0, productRef: 0})

        const length = await Product.estimatedDocumentCount()

        const data = {
            length,
            products,
            pages: length / limit
        }

        res.status(200).json(data)
    } catch (error) {
        res.status(404).send({message: `${error.message} Internal Server Error`})
    }
}

export const getProductOrderList  = async (req, res) => {
    try {
        const { category, subCategory} = req.body
        
        if(category !== 'all') {
            const orderlist = await Product.find({category, subCategory})
            .sort({updatedAt: -1})
            .populate('category', {__v: 0, updatedAt: 0, subCategory: 0})
            .populate('subCategory', {__v: 0, updatedAt: 0, productRef: 0})

            return res.send(orderlist)
        }
        const orderlist = await Product.find({})
        .sort({updatedAt: -1})
        .populate('category', {__v: 0, updatedAt: 0, subCategory: 0})
        .populate('subCategory', {__v: 0, updatedAt: 0, productRef: 0})
        res.send(orderlist)
    } catch (error) {
        res.status(404).send({message: `${error.message} Internal Server Error`})
    }
}


const productPriceUpdate = async ({product, increaseRate, salesPrice, purchasePrice }) => {
    await Product.findByIdAndUpdate(product, {$set: {increaseRate, salesPrice, purchasePrice}})
}


export const getSearchData = async (req,res) => {
    const {query} = req.params
    
   
//    const products = await Product.find({productName: {$regex:  new RegExp(query)}})
//     res.send(products)
    Product.find({
      
            productName: {
                $regex: new RegExp(query)
            }
    }, {
        __v: 0,

    }, {
        populate: 'category', select: {subCategory: 0, __v: 0}
    }, async function(err, data) {

        const result = await Product.find({
               
            SKU_UPC: {
                    $regex: new RegExp(query)
            }
        }).populate('category', {subCategory: 0, __v: 0})
        .select({
            __v: 0,})

        if(result?.length > 0){
            result?.flatMap(item =>data.push(item))
        }
        res.send(data)
    })
   
}

export const getProductStockDue = async (req,res) => {
    const products = await Product?.find({quantity: {$le: 2}})
   res.send(products)
}

export const priceControl = (req, res) => {
    const { body } = req

    body.forEach(element => {
        productPriceUpdate(element)
    });

    res.status(201).send({message: `${body?.length} product prices updated`})
    
}

export const createProduct = async (req, res) => {
    try {
        const { _id, isDelete, SKU_UPC, discount, productName, category, subCategory, purchasePrice, salesPrice, bulkPrice } = req.body
        
        const newProduct = new Product({SKU_UPC, discount, productName,category,  subCategory, purchasePrice, bulkPrice, salesPrice})

        const subcategory = await Subcategory.findByIdAndUpdate(subCategory, {$addToSet: {productRef:newProduct?._id}})
        const error = newProduct.validateSync()
        if (error && error.message) return res.status(404).send({message: error.message.split(':')[2].split(',')[0]});

        if(_id && isDelete) {
            await Product.findByIdAndUpdate(_id, {$set: {status: 'Deleted'}})
            return res.status(201).send({message: `${productName} Deleted successful`})
        }

        if(_id){
            const {createdAt} = await Product.findByIdAndUpdate({_id}, {SKU_UPC, discount, productName,category, bulkPrice, subCategory, purchasePrice, salesPrice}, {upsert: true} )
            if(!createdAt) return res.status(404).send({message: 'Internal Server Error'})
        }else {
            newProduct.save()
        }

        res.status(201).send({message: `${productName} ${_id? ' updated successful': ' created successful'}`})
    } catch (error) {
        res.status(404).send({message: `${error.message} Internal Server Error`})
    }
}