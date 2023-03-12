import express from 'express'
const router = express.Router()
import { sendMoney,getTransactionHistory } from '../controller/transactionController.js'
import { protect } from '../middlewares/auth.js'
router.route("/payment/:paymentId").post(protect,sendMoney)
router.route("/transactions").get(protect,getTransactionHistory)


export default router