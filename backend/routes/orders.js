import express from "express";
import { supabase } from "../supabaseClient.js";
import { verifyUser, verifyAdmin } from "../middleware/verifyuser.js";

const router = express.Router();

// 1. Place an Order
router.post("/place", verifyUser, async (req, res) => {
    try {
        const { data: cartItems, error: cartError } = await supabase
            .from("cart")
            .select("*, products(price)")
            .eq("user_id", req.user.id);

        if (cartError || !cartItems?.length) return res.status(400).json({ error: "Cart is empty" });

        const totalPrice = cartItems.reduce((acc, item) => acc + (item.products.price * item.quantity), 0);

        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert([{ user_id: req.user.id, total_price: totalPrice }])
            .select().single();

        if (orderError) throw orderError;

        const orderItemsData = cartItems.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            size: item.size,
            quantity: item.quantity,
            price_at_order: item.products.price
        }));

        await supabase.from("order_items").insert(orderItemsData);
        await supabase.from("cart").delete().eq("user_id", req.user.id);

        res.json({ message: "Order placed successfully", orderId: order.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. [Admin Only] Get all orders
router.get("/all", verifyAdmin, async (req, res) => {
    const { data, error } = await supabase
        .from("orders")
        .select(`
      id, total_price, status, user_id, created_at,
      profiles (full_name),
      order_items (id, quantity, size, price_at_order, products (title, image))
    `)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 3. User Order History
router.get("/", verifyUser, async (req, res) => {
    const { data, error } = await supabase
        .from("orders")
        .select(`
      id, total_price, status, created_at,
      order_items (id, quantity, size, price_at_order, products (title, image))
    `)
        .eq("user_id", req.user.id)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error });
    res.json(data);
});

export default router;
