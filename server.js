import app from "./app.js";
import connectionToDB from "./config/dbConnection.js";

const PORT = process.env.PORT || 5005;
app.listen(PORT, async () => {
    await connectionToDB();
    console.log(`App is running at http://localhost:${PORT}`);
});
