import express from "express";
import { supabase } from "../supabaseClient.js";
import { verifyUser, verifyAdmin } from "../middleware/verifyuser.js";

const router = express.Router();

// 1. Place an Order
router.post("/place", verifyUser, async (req, res) => {
    const { address, phone, paymentMethod } = req.body;

    try {
        const { data: cartItems, error: cartError } = await req.supabase
            .from("cart")
            .select("*, products(price)")
            .eq("user_id", req.user.id);

        if (cartError || !cartItems?.length) return res.status(400).json({ error: "Cart is empty" });

        const totalPrice = cartItems.reduce((acc, item) => acc + (item.products.price * item.quantity), 0);

        const { data: order, error: orderError } = await req.supabase
            .from("orders")
            .insert([{
                user_id: req.user.id,
                total_price: totalPrice,
                address,
                phone,
                payment_method: paymentMethod || 'COD'
            }])
            .select().single();

        if (orderError) throw orderError;

        const orderItemsData = cartItems.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            size: item.size,
            quantity: item.quantity,
            price_at_order: item.products.price
        }));

        await req.supabase.from("order_items").insert(orderItemsData);
        await req.supabase.from("cart").delete().eq("user_id", req.user.id);

        res.json({ message: "Order placed successfully", orderId: order.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. [Admin Only] Get all orders
router.get("/all", verifyAdmin, async (req, res) => {
    console.log("Admin Orders Request Received for user:", req.user?.id);
    try {
        const { data, error } = await req.supabase
            .from("orders")
            .select("*")
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Admin Orders Error:", error);
            return res.status(500).json({ error: error.message });
        }
        console.log("Admin Orders Data found:", data?.length);
        res.json(data);
    } catch (err) {
        console.error("Server Admin Orders Error:", err);
        res.status(500).json({ error: err.message });
    }
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
