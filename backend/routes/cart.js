import express from "express";
import { supabase } from "../supabaseClient.js";
import { verifyUser } from "../middleware/verifyuser.js";

const router = express.Router();

router.post("/add", verifyUser, async (req, res) => {
  const { productId, size, quantity = 1 } = req.body;

  try {
    // Check if the item already exists using maybeSingle to avoid 406 errors
    const { data: existing, error: findError } = await req.supabase
      .from("cart")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("product_id", productId)
      .eq("size", size)
      .maybeSingle();

    if (findError) throw findError;

    if (existing) {
      const { error: updateError } = await req.supabase
        .from("cart")
        .update({ quantity: (existing.quantity || 1) + quantity })
        .eq("id", existing.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await req.supabase
        .from("cart")
        .insert([
          {
            user_id: req.user.id,
            product_id: productId,
            size,
            quantity: quantity
          }
        ]);
      if (insertError) throw insertError;
    }

    res.json({ message: "Added to cart" });
  } catch (err) {
    console.error("Cart Add Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", verifyUser, async (req, res) => {
  const { data, error } = await req.supabase
    .from("cart")
    .select(`
      id,
      quantity,
      size,
      products (*)
    `)
    .eq("user_id", req.user.id);

  if (error)
    return res.status(500).json({ error });

  res.json(data);
});

router.delete("/remove/:id", verifyUser, async (req, res) => {
  const { error } = await req.supabase
    .from("cart")
    .delete()
    .eq("id", req.params.id)
    .eq("user_id", req.user.id);

  if (error)
    return res.status(500).json({ error });

  res.json({ message: "Removed from cart" });
});

router.put("/update/:id", verifyUser, async (req, res) => {
  const { quantity } = req.body;
  const { error } = await req.supabase
    .from("cart")
    .update({ quantity })
    .eq("id", req.params.id)
    .eq("user_id", req.user.id);

  if (error)
    return res.status(500).json({ error });

  res.json({ message: "Cart updated" });
});

export default router;
