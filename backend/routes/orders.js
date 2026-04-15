import express from "express";
import { supabase } from "../supabaseClient.js";
import { verifyUser, verifyAdmin } from "../middleware/verifyuser.js";
import { sendOrderEmail } from "../utils/mailer.js";

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

        // Fetch items with product details for email
        const { data: fullItems } = await req.supabase
            .from("order_items")
            .select("*, products(title)")
            .eq("order_id", order.id);

        await req.supabase.from("cart").delete().eq("user_id", req.user.id);

        // Send Email (Non-blocking)
        sendOrderEmail(order, req.user, fullItems || []);

        res.json({ message: "Order placed successfully", orderId: order.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. [Admin Only] Get all orders
router.get("/all", verifyAdmin, async (req, res) => {
    try {
        const { data, error } = await req.supabase
            .from("orders")
            .select(`
                *,
                profiles (full_name, phone),
                order_items (
                    id, quantity, size, price_at_order,
                    products (title, image)
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. [Admin Only] Update Order Status
router.put("/status/:orderId", verifyAdmin, async (req, res) => {
    const { status } = req.body;
    const { orderId } = req.params;
    console.log(`Setting order ${orderId} status to: ${status}`);
    try {
        // Use the global supabase client (Service Role) to bypass RLS for admin updates
        const { data, error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", orderId)
            .select();

        if (error) throw error;
        console.log("Update success:", data);
        res.json({ message: "Status updated", data });
    } catch (err) {
        console.error("Update fail:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 3. User Order History
router.get("/", verifyUser, async (req, res) => {
    try {
        const { data, error } = await req.supabase
            .from("orders")
            .select(`
          id, total_price, status, created_at,
          order_items (id, quantity, size, price_at_order, products (title, image))
        `)
            .eq("user_id", req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Order fetch error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
