import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import cartRoutes from "./routes/cart.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import reviewRoutes from "./routes/reviews.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
app.use(express.json());

app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  console.log("server is on");
  res.send("E-com API Server Running");
});
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);
