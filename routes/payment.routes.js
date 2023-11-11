import { Router } from 'express';
import {
    getRazorpayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayments,
} from '../controllers/payment.controller.js';
import {
    authorizeRoles,
    authorizeSubscribers,
    isLoggedIn,
} from '../middlewares/auth.middleware.js';


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
    .route('/unsubscribe')
    .post(isLoggedIn, authorizeSubscribers, cancelSubscription);
router
    .route('/')
    .get(
        isLoggedIn,
        authorizeRoles('ADMIN'),
        allPayments)

export default router;