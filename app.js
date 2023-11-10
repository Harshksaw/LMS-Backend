import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import morgan from "morgan";
import errorMiddleware from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";
import courseRoutes from './routes/course.routes.js'
import paymentRoutes from './routes/payment.routes.js'
config();
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// used to parse data sent in the URL-encoded format. URL-encoded data is commonly 
// used in HTML forms to send data to the server in a key-value pair format, 
// with data separated by & and keys and values separated by =

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan("dev")); //logger middleware
//Routes of modules

app.use("/ping", function (req, res) {
  res.send("/pong");
});
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/course", courseRoutes)
app.use("/api/v1/payments", paymentRoutes)

app.all("*", (req, res) => {
  res.status(404).send("OOPS !! 404 PAGE NOT FOUND");
});

// generic Error handling
app.use(errorMiddleware);

export default app;
