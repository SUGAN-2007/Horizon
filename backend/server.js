import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import cartRoutes from "./routes/cart.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import reviewRoutes from "./routes/reviews.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

app.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);
