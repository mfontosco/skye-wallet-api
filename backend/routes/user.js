import express from 'express'
import {deleteAllUsers, registerUser,getAllUsers,loginUser, generatePaymentIdByUser,deletePaymentID,getUserByPaymentID} from '../controller/user.js'
const router = express.Router()


// router.route.get("/",getAllUsers)
router.route('/register').post(registerUser).get(getAllUsers)
router.route('/login').post(loginUser)
router.route('/:paymentId').get(getUserByPaymentID)
router.route('/:id/paymentId').post(generatePaymentIdByUser)
router.route('/:userId/paymentIds/:paymentId').delete(deletePaymentID)
router.route('/delete').delete(deleteAllUsers)
export default router