import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import morgan from 'morgan';
import errorMiddleware from './middlewares/error.middleware.js';

config();

const app = express();

app.use(express.json())

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}))

app.use(cookieParser());

app.use('/ping', function (req, res) {
    res.send('/pong')
})
app.use(morgan('dev')) //logger middleware
//Routes of modules

app.all('*', (req, res) => {
    res.status(404).send('OOPS !! 404 PAGE NOT FOUND');
})

//generic Error handling
app.use(errorMiddleware);



export default app;