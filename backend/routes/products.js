import express from "express";
import { supabase } from "../supabaseClient.js";
import { verifyAdmin } from "../middleware/verifyuser.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error)
    return res.status(500).json({ error });

  res.json(data);
});

router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error)
    return res.status(500).json({ error });

  res.json(data);
});

// Admin ONLY: Add new product
router.post("/add", verifyAdmin, async (req, res) => {
  const { title, description, category, price, image, sizes } = req.body;

  const { data, error } = await supabase
    .from("products")
    .insert([{
      title,
      description,
      category,
      price: parseFloat(price),
      image,
      sizes: Array.isArray(sizes) ? sizes : sizes.split(',').map(s => s.trim())
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Product added successfully", product: data[0] });
});

// Admin ONLY: Update product
router.put("/:id", verifyAdmin, async (req, res) => {
  const { title, description, category, price, image, sizes } = req.body;

  const { data, error } = await supabase
    .from("products")
    .update({
      title,
      description,
      category,
      price: parseFloat(price),
      image,
      sizes: Array.isArray(sizes) ? sizes : (typeof sizes === 'string' ? sizes.split(',').map(s => s.trim()) : sizes)
    })
    .eq("id", req.params.id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Product updated successfully", product: data[0] });
});

// Admin ONLY: Delete product
router.delete("/:id", verifyAdmin, async (req, res) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Product deleted successfully" });
});

export default router;
