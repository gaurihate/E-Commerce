import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import cors from 'cors'
import categoryRoute from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoutes.js";

// configure env (MUST be first) loads values from the .env
dotenv.config();

// rest object
const app = express();

// database config 
// Calls your MongoDB connection function
// When server starts → database gets connected
// Usually uses Mongoose inside db.js
connectDB();

//  Middleware = code that runs before routes
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes Route Grouping
app.use('/api/v1/auth', authRoute)  // api for authroute file in routes----->authConyroller(overall logic of route) ROUTE GROUPPING
app.use('/api/v1/category', categoryRoute)
app.use("/api/v1/product", productRoutes);

// rest api
app.get("/", (req, res) => {
    res.send("<h1>Welcome</h1>");
});

// port
const PORT = process.env.PORT || 8080;

// run server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



