import { Order } from "../models/Order.js"
import { Drawer } from "../models/Drawer.js"
import { Orderitem } from "../models/OrderItems.js"
import { Product } from "../models/Product.js"

let start = new Date();
start.setHours(0,0,0,0)
let end = new Date(23,59,59,999)

export const getSalesOrders = async(req, res) => {
    try {
        const {id, role: {manager}} = req.user
        if(!manager) {
            const data = await Order.find({orderType: 'SALE', userRef: id, createdAt: {
                $gte: start
            } })
            .populate('customerRef', {__v: 0, updatedAt: 0})
            .populate('userRef', {__v: 0, updatedAt: 0, password: 0}).sort({updatedAt: -1})
            return res.json(data)
        }

        const data = await Order.find({orderType: 'SALE'})
        .populate('customerRef', {__v: 0, updatedAt: 0})
        .populate('userRef', {__v: 0, updatedAt: 0, password: 0}).sort({updatedAt: -1})
        res.json(data)
    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}

export const closeSalesOrders = async(req, res) => {
    try {
       const {id} = req.user
        const data = await Order.find({orderType: 'SALE', createdAt: {
            $gte: start
        }, userRef: id})
        .populate('customerRef', {__v: 0, updatedAt: 0})
        .populate('userRef', {__v: 0, updatedAt: 0, password: 0}).sort({updatedAt: -1})

        const cashData = await Order.find({orderType: 'SALE', createdAt: {
            $gte: start
        }, userRef: id, "payment.payMethod": 'Cash' })
        .select({payment: 1})

        const posData = await Order.find({orderType: 'SALE', createdAt: {
            $gte: start
        }, userRef: id, "payment.payMethod": 'POS' })
        .select({payment: 1})

        const transferData = await Order.find({orderType: 'SALE', createdAt: {
            $gte: start
        }, userRef: id, "payment.payMethod": 'Transfer' })
        .select({payment: 1})

        const paidAmount = data?.length > 0 ? data?.reduce((a, b) =>  a + b.totalPaid, 0) : 0
        const dryCashAmount = data?.length > 0 ? data?.filter(item => item.status =='Open' && item.amount > item.totalPaid)?.reduce((a, b) =>  a + b.amount - b.totalPaid, 0) : 0
        const changeAmount = data?.length > 0 ? data?.filter(item =>item.totalPaid >  item.amount )?.reduce((a, b) =>  a +  b.totalPaid - b.amount, 0) : 0
        const totalAmount = data?.length > 0 ? data?.reduce((a, b) =>  a + b.amount, 0) : 0


        function handleCheck (datus, type) {
            let cash = []

            const filterdatus = datus?.map(item =>item.payment)
            filterdatus?.map((_, index) =>{
                filterdatus[index]?.map(item => {
                    if(item.payMethod == type) return cash.push(item)
                }) 
               
            })
            const sum = cash.reduce((a, b) => a + b.amount, 0) 
           return sum
        }

        const cashTotal = handleCheck(cashData, 'Cash')
        const posTotal = handleCheck(posData, 'POS')
        const transferTotal = handleCheck(transferData, 'Transfer')
        const accountBalance = paidAmount  - changeAmount == totalAmount
        
        const result = {
            paidAmount,
            changeAmount,
            dryCashAmount,
            totalAmount,
            cashTotal,
            posTotal,
            transferTotal,
            accountBalance
        }
       
        res.json(result)
    } catch (error) {
        res.status(404).send({message: `${error.message} Internal Server Error`})
    }
}

export const handleCloseSales = async (req, res) => {
    try {
        const {id} = req.user

        const {paidAmount, dryCashAmount, totalAmount, closeID,
            cashTotal, posTotal, transferTotal, changeAmount, accountBalance
        } = req.body

        await Drawer.findOneAndUpdate({closeID}, {
            paidAmount, dryCashAmount, totalAmount, accountBalance,closeID,
            cashTotal, posTotal, transferTotal, changeAmount, userRef: id
        }, {upsert: true})

        // await newDrawer.save()

        res.send({message: 'Sales Closed Successful'})

    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}

export const getClosedSalesPeriodic = async (req, res) => {
    try {
        const {endDate, startDate} = req.params
        const start  = new Date(startDate)
        const end  = new Date(endDate)


        end.setDate(end.getDate() + 1)

            const data = await Drawer.find({createdAt: {
            $gte: start,
            $lt: end
            
        }}).populate('userRef', {password: 0, __v: 0, updatedAt: 0}).select({__v: 0, updatedAt: 0})
       
        res.send(data)

    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}

export const getPurchasesOrders = async(req, res) => {
    try {
        
        const { id, role: {manager} } = req.user

        if(!manager) {
            const data = await Order.find({orderType: 'PURCHASE', userRef: i}) 
            .populate('customerRef', {__v: 0, updatedAt: 0})
            .populate('userRef', {__v: 0, updatedAt: 0, password: 0}).sort({updatedAt: -1})
            return res.json(data)
        }

        const data = await Order.find({orderType: 'PURCHASE'}) 
        .populate('customerRef', {__v: 0, updatedAt: 0})
        .populate('userRef', {__v: 0, updatedAt: 0, password: 0}).sort({updatedAt: -1})
        res.json(data)

    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}

export const getOrderByStatus = async(req, res) => {
    try {
        const {status}= req.params
        const {id, role: {manager}}  = req.user

        if(!manager) {
            const data = await Order.find({status, userRef: id})
            .populate('customerRef', {__v: 0, updatedAt: 0})
            .populate('userRef', {__v: 0, updatedAt: 0, password: 0}).sort({updatedAt: -1})
            return res.json(data)
        }

        const data = await Order.find({status})
        .populate('customerRef', {__v: 0, updatedAt: 0})
        .populate('userRef', {__v: 0, updatedAt: 0, password: 0}).sort({updatedAt: -1})
        res.json(data)
        
    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}
export const getCustomerOrders = async (req, res) =>{
    try {
        const {orderId} = req.params
        const custId = await Order.findOne({orderId}).select({customerRef: 1})
        if(!custId) return res.status(404).send({message: `Please enter valid sale id`})

        const orders = await Order.find({customerRef: custId?.customerRef})
        .populate('customerRef', {__v: 0, updatedAt: 0})
        res.send(orders)
    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const {id, role: {manager}} = req.user
        
        if(!manager) {
            const orders = await Order.find({status:{$ne: 'Void'},  createdAt: {
                $gte: start
            }, userRef: id}).select({__v: 0, updatedAt: 0})
            .populate('customerRef', {__v: 0, updatedAt: 0})
            .populate('userRef', {__v: 0, updatedAt: 0, password: 0}).sort({updatedAt: -1})

            
           return res.send(orders)
        }

        const orders = await Order.find({status:{$ne: 'Void'}}).select({__v: 0, updatedAt: 0})
        .populate('customerRef', {__v: 0, updatedAt: 0})
        .populate('userRef', {__v: 0, updatedAt: 0, password: 0}).sort({updatedAt: -1})

        
        res.send(orders)

    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}

export const getOrderByDate = async (req, res) => {
    try {
        const {id, role: {manager}} = req.user
       
        const orders = await Order.find({status:{$ne: 'Void'},  createdAt: {
            $gte: start
        }, userRef: id}).select({__v: 0, updatedAt: 0})
        .populate('customerRef', {__v: 0, updatedAt: 0})
        .populate('userRef', {__v: 0, updatedAt: 0, password: 0}).sort({updatedAt: -1})

        
        res.send(orders)

    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}

export const getAllOrderItems = async (req, res) => {
    try {
        
        const items = await Orderitem.find({})
        res.json(items)
    } catch (error) {
        
        res.status(404).send({message: `${error.message} Internal Server Error`})
    }
}

export const getOrderItems = async(req, res) => {
    try {
        const {orderId} = req.params
        const items = await Orderitem.find({orderId}).select({__v: 0, updatedAt: 0})
        .populate('productRef', {__v: 0, updatedAt: 0})

        const products = await Product.find().where('_id').in(items.map(item => item?.productRef))
        .select({__v: 0, updatedAt: 0})
        .populate('category', {__v: 0, updatedAt: 0, subCategory: 0})
        .populate('subCategory', {__v: 0, updatedAt: 0, productRef: 0})
        .exec();
        res.send({data: items, products})
    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}

export const getOrderItemsByDate_Product = async(req, res) => {
    try {
        const {from, to, product} = req.params
        if(from && to && product?.length >= 20){
            const items = await Orderitem.find({productRef:product, orderType: 'SALE', createdAt: {
                $gte: new Date(from).toISOString(),
                $lt: new Date(to).toISOString()
            }})
            
            .select({__v: 0, updatedAt: 0})
            .populate('productRef', {__v: 0, updatedAt: 0})
            return res.send(items)
        }

        if(from && to && product?.length == 2){
            const items = await Orderitem.find({ orderType: 'SALE',  createdAt: {
                $gte: new Date(from).toISOString(),
                $lt: new Date(to).toISOString()
            }})
            
            .select({__v: 0, updatedAt: 0})
            .populate('productRef', {__v: 0, updatedAt: 0})
            return res.send(items)
        }
        res.status(404).send({message: `Invalid request try again`})
       
    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}

const handleUpdateProduct = async(id, type, qty) => {
    const product = await Product.findById(id)
    return await product.updateQty(id, type, qty)
}

const handleUpdateOrderItem = async(item, next) => {
   try {
    const {quantity, orderType, productRef, orderRow} = item
    // console.log(productRef)
    // const newitem = new Orderitem({...item})
    // if(orderItem?.orderRow) return Orderitem.findByIdAndUpdate(orderItem?._id, {$set: {...item}})
        // handleUpdateProduct(productRef, orderType, quantity)
    // Orderitem.create({...item}, async(err, result) =>{
    //    try {
         
            // if(err) {
                const orderItem = await Orderitem.findOne({orderRow})
                if(orderItem) {
                    
                    const qty = quantity > orderItem?.quantity ? quantity - orderItem?.quantity : quantity < orderItem.quantity ? orderItem.quantity - quantity :0
                    const type = orderType == 'PURCHASE' && quantity < orderItem?.quantity ? 'SALE': item?.orderType
                    
                    await Orderitem.findOneAndUpdate({orderRow},  {...item}, {upsert: true})
                
                    return handleUpdateProduct(productRef, type, qty )
                }
                await Orderitem.findOneAndUpdate({orderRow},  {...item}, {upsert: true})
                
                    handleUpdateProduct(productRef, orderType, quantity )
            // }

            handleUpdateProduct(productRef, orderType, quantity)
    //    } catch (error) {
    //     return err
    //    }

    // })
    // handleUpdateProduct(productRef, orderType, quantity)
   } catch (error) {
       next(error.message)
   }
        
}

export const removeOrderItem = async (req, res) => {
    try {
        const {orderRow} = req.params
        const row = await Orderitem.findOne({orderRow})
        
       const isDelete =  await Orderitem.deleteOne({orderRow})

       if(isDelete) {
            const { orderId, amount } = row
            const order = await Order.findOne({orderId})
            const totalAmount = order?.amount - amount
            Order.findByIdAndUpdate(order?._id, {$set: {amount: totalAmount}})
            return res.send({message: 'Row Removed'})
        }
        res.status(404).send({message: `Row not deleted, Internal Server Error`})
        
       
    } catch (error) {
        return res.status(404).send({message: `Internal Server Error`})
    }
}

export const removeOrder = async (req, res) => {
    try {
        const {orderId} = req.params
        await Order.findOneAndUpdate({orderId}, {$set: {status: 'Void'}})
        
        await Orderitem.updateMany({orderId}, {$set: {status: 'Void'}})
        res.status(201).send({message: `#${orderId} Order deleted successful`})

    } catch (error) {
        return res.status(404).send({message: `${error.message} Internal Server Error`})
    }
}

export const placeOrder = async (req, res, next) => {
    try {
       const { user } = req
        const userRef = user?._id

        const { orderId, status,orderType, payment, customerRef, amount, totalPaid, orderOn, VALUES } = req.body
        console.log(req.body)
        const newOder = new Order({orderId, status, orderOn: new Date(), orderType, customerRef, userRef, amount, totalPaid, payment})
        if(!orderType || !customerRef || !userRef || !amount || !VALUES?.length > 0) return res.status(404).send({message: 'Invalid request'})
        const error = newOder.validateSync()
        if (error && error.message) return res.status(404).send({message: error.message.split(':')[2].split(',')[0]});

    
        // const {updatedAt} = await newOder.save()
        // const orderItems = VALUES
        await Order.findOneAndUpdate({orderId}, {status, orderOn: new Date(), orderType, customerRef, userRef, amount, totalPaid, payment}, {upsert:true})
        //    await Orderitem.insertMany(VALUES)
            VALUES.map(item =>{

                const {productRef, quantity, orderType} = item
                const qty = parseInt(quantity)
                // handleUpdateProduct(productRef, orderType, qty)
                handleUpdateOrderItem(item, next)
            });
        
        res.status(201).send({message: `Order successful`})
    } catch (error) {
        console.warn(error)
        return res.status(404).send({message: `Internal Server Error1`})
    }
}
