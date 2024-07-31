import express from 'express'
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from '../controller/orderController.js'
import authMiddleware from '../middleware/auth.js'


const orderRouter = express.Router()

orderRouter.post('/place-order',authMiddleware, placeOrder)
orderRouter.post('/verify-order', verifyOrder)
orderRouter.post('/user-orders',authMiddleware, userOrders)
orderRouter.post('/order-list', listOrders )
orderRouter.post('/status-update', updateStatus)

export default orderRouter