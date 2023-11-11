
import { razorpay } from "../server.js";
import AppError from '../utils/appError.js';



export const getRazorpayApiKey = async (req, res, next) => {

    try {
        res.status({
            success: true,
            message: 'RazorPay API KEY',
            key: process.env.RAZORPAY_KEY_ID,
        })
    } catch (e) { e.message, 500 }

}
export const buySubscription = async (req, res, next) => {

try{
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
        return next(
            new AppError('Unauthorized ,Please Login',)
        )
    }
    if (user.role === 'ADMIN') {
        new AppError('Admin cannot purchase a subscription', 400)
    }
    const subscription = await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_PLAN_ID,
        customer_notify: 1

    })
    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'SUbscription successfully',

        subscription_id: subscription.id
    })

}catch(e){
    return next(
        new AppError(e.message, 500)
    )
}
    

}
export const verifySubscription = async (req, res, next) => {
    const { id } = req.user
    const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id } = req.body;

    const user = await findById(id)
    if (!user) {
        return next(
            new AppError('Unauthorized , please login')
        )

    }

    const subscriptionId = user.subscription.id;

    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subscriptionId}`)
        .digest('hex');

    if (generatedSignature !== razorpay_signature) {
        return next(
            new AppError('Paymnet not verified , please type again', 500)

        )
    }
    await Payment.create({
        razorpay_payment_id,
        razorpay_signature,
        razorpay_subscription_id
    })
    user.subscription.status = 'active';
    await user.save();
    res.status(200).json({
        success: true,
        message: 'Payment verified Successfully'
    })

}
export const cancelSubscription = async (req, res, next) => {
    try {

        const { id } = req.user

        if (!user) {
            return next(
                new AppError('Unauthorized ,Please Login',)
            )
        }
        if (user.role === 'ADMIN') {
            new AppError('Admin cannot purchase a subscription', 400)
        }
        const subscriptionId = user.subscription.id;
        const subscription = await rezorpay.subscription.cancel(
            subscriptionId
        )
        user.subscription.status = subscription.status;

        await user.save()
    }
    catch (e) {
        return next(
            new AppError(e.message, 500)
        )
    }


}
export const allPayments = async (req, res, next) => {
    const {count} = req.query;
    const subscriptions = await razorpay.subscriptions.all({
        count: count || 10,

    })
        res.status(200).json({
            success:true
        })
 }