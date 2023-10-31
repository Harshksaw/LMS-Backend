import { Router } from "express";
import { buySubscription, cancelSubscription, getRazorpayApiKey, verifySubscription } from "../controllers/payment.controller.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";


const router = Router();

router
    .route('/razorpay-key')
    .get(
        isLoggedIn,
        getRazorpayApiKey
        
        )

router 
    .route('/subscribe')
    .post(
        isLoggedIn,
        buySubscription)

router
    .route('/verify')
    .post(
        isLoggedIn,
        verifySubscription)

router
    .route('/unSubscribe')
    .post(
        isLoggedIn,
        cancelSubscription)

router
    .route('/')
    .get(allPayments)

export default router;