import express from "express";
import { supabase } from "../supabaseClient.js";
import { verifyUser } from "../middleware/verifyuser.js";

const router = express.Router();

router.post("/add", verifyUser, async (req, res) => {
  const { productId, size } = req.body;

  const { data: existing } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", req.user.id)
    .eq("product_id", productId)
    .eq("size", size)
    .single();

  if (existing) {
    await supabase
      .from("cart")
      .update({ quantity: existing.quantity + 1 })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("cart")
      .insert([
        {
          user_id: req.user.id,
          product_id: productId,
          size,
          quantity: 1
        }
      ]);
  }

  res.json({ message: "Added to cart" });
});

router.get("/", verifyUser, async (req, res) => {
  const { data, error } = await supabase
    .from("cart")
    .select(`
      id,
      quantity,
      size,
      products (
        id,
        name,
        price,
        image_url
      )
    `)
    .eq("user_id", req.user.id);

  if (error)
    return res.status(500).json({ error });

  res.json(data);
});

export default router;
