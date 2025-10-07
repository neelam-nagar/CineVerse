import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"; 
import movieRoutes from "./routes/movieRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",   // your React app URL
  credentials: true                  // allow cookies
}));
app.use(express.json());
app.use(cookieParser()); 

// If you accept URL-encoded forms
app.use(express.urlencoded({ extended: true }));


// Routes
app.get("/", (req, res) => res.send("App is running"));
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

// Connect to MySQL
(async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Connected");
  } catch (err) {
    console.error("DB Error:", err);  // show full error object  -->err.message to show actual message
  }
})();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
