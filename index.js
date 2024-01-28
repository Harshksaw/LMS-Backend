const express = require('express');

const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");


const database = require('./config/database');
const app = express();
dotenv.config();
const PORT = 3000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(
	{
		origin: "http://localhost:3000",
		credentials: true,
	}

	
));	

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	}
))

cloudinaryConnect();



// app.use('/api', router);
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
// app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);


//def route	

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})