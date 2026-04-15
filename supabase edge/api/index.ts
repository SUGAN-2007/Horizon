import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Hono } from "https://deno.land/x/hono@v3.1.8/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import nodemailer from "https://esm.sh/nodemailer@6.9.3";
import { cors } from 'https://deno.land/x/hono@v3.1.8/middleware.ts'

const app = new Hono().basePath("/api");

app.use('*', cors())

// Helper to create Supabase client
const getSupabase = (c) => {
    const authHeader = c.req.header("Authorization");
    return createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        {
            global: {
                headers: authHeader ? { Authorization: authHeader } : {},
            },
        }
    );
};

// --- Middleware ---
const verifyUser = async (c, next) => {
    const supabase = getSupabase(c);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return c.json({ error: "Unauthorized" }, 401);
    c.set("user", user);
    c.set("supabase", supabase);
    await next();
};

const verifyAdmin = async (c, next) => {
    const supabase = getSupabase(c);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return c.json({ error: "Unauthorized" }, 401);

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') return c.json({ error: "Admin access denied" }, 403);
    c.set("user", user);
    c.set("supabase", supabase);
    await next();
};

// --- Email Helper ---
const sendOrderEmail = async (order, user, items) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: Deno.env.get("MAIL_USER"),
            pass: Deno.env.get("MAIL_PASS")
        }
    });

    const adminEmail = 'e.com.hori@gmail.com';
    const gst = (order.total_price * 0.18).toFixed(2);

    const mailOptions = {
        from: `"Horizon Store" <${Deno.env.get("MAIL_USER")}>`,
        to: `${user.email}, ${adminEmail}`,
        subject: `Thank you for your purchase - Order #${order.id.slice(0, 8)}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2>Horizon Receipt</h2>
            <p>Order number: HORZ-${order.id.slice(0, 8).toUpperCase()}</p>
            <p>Total: ₹${order.total_price.toFixed(2)} (Includes GST ₹${gst})</p>
            <hr/>
            <ul>${items.map(it => `<li>${it.products.title} (x${it.quantity}) - ₹${(it.price_at_order * it.quantity).toFixed(2)}</li>`).join('')}</ul>
        </div>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) { console.error("Email fail:", err); }
};

// --- Routes ---

// 1. Products
app.get("/products", async (c) => {
    const supabase = getSupabase(c);
    const { data, error } = await supabase.from("products").select("*");
    if (error) return c.json({ error }, 500);
    return c.json(data);
});

app.get("/products/:id", async (c) => {
    const supabase = getSupabase(c);
    const { data, error } = await supabase.from("products").select("*").eq("id", c.req.param("id")).single();
    if (error) return c.json({ error }, 500);
    return c.json(data);
});

// 2. Cart
app.post("/cart/add", verifyUser, async (c) => {
    const body = await c.req.json();
    const user = c.get("user");
    const supabase = c.get("supabase");
    const { productId, size, quantity = 1 } = body;

    const { data: existing } = await supabase.from("cart").select("*").eq("user_id", user.id).eq("product_id", productId).eq("size", size).maybeSingle();

    if (existing) {
        await supabase.from("cart").update({ quantity: (existing.quantity || 1) + quantity }).eq("id", existing.id);
    } else {
        await supabase.from("cart").insert([{ user_id: user.id, product_id: productId, size, quantity }]);
    }
    return c.json({ message: "Added to cart" });
});

app.get("/cart", verifyUser, async (c) => {
    const user = c.get("user");
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("cart").select("id, quantity, size, products (*)").eq("user_id", user.id);
    if (error) return c.json({ error }, 500);
    return c.json(data);
});

// 3. Orders
app.post("/orders/place", verifyUser, async (c) => {
    const { address, phone, paymentMethod } = await c.req.json();
    const user = c.get("user");
    const supabase = c.get("supabase");

    const { data: cartItems } = await supabase.from("cart").select("*, products(price)").eq("user_id", user.id);
    if (!cartItems?.length) return c.json({ error: "Cart empty" }, 400);

    const totalPrice = cartItems.reduce((acc, it) => acc + (it.products.price * it.quantity), 0);

    const { data: order, error } = await supabase.from("orders").insert([{
        user_id: user.id, total_price: totalPrice, address, phone, payment_method: paymentMethod || 'COD'
    }]).select().single();

    if (error) return c.json({ error }, 500);

    const orderItemsData = cartItems.map(it => ({
        order_id: order.id, product_id: it.product_id, size: it.size, quantity: it.quantity, price_at_order: it.products.price
    }));

    await supabase.from("order_items").insert(orderItemsData);
    const { data: fullItems } = await supabase.from("order_items").select("*, products(title)").eq("order_id", order.id);
    await supabase.from("cart").delete().eq("user_id", user.id);

    sendOrderEmail(order, user, fullItems || []);
    return c.json({ message: "Order placed", orderId: order.id });
});

app.get("/orders", verifyUser, async (c) => {
    const user = c.get("user");
    const supabase = c.get("supabase");
    const { data } = await supabase.from("orders").select("*, order_items(*, products(*))").eq("user_id", user.id).order('created_at', { ascending: false });
    return c.json(data);
});

// 4. Reviews
app.get("/reviews/:productId", async (c) => {
    const supabase = getSupabase(c);
    const { data } = await supabase.from("reviews").select("*, profiles(full_name), review_replies(*)").eq("product_id", c.req.param("productId")).order("created_at", { ascending: false });
    return c.json(data);
});

app.post("/reviews/add", verifyUser, async (c) => {
    const { productId, rating, comment } = await c.req.json();
    const user = c.get("user");
    const supabase = c.get("supabase");
    await supabase.from("reviews").insert({ user_id: user.id, product_id: productId, rating, comment });
    return c.json({ message: "Review added" });
});

// 5. Admin
app.get("/orders/all", verifyAdmin, async (c) => {
    const supabase = c.get("supabase");
    const { data } = await supabase.from("orders").select("*, profiles(full_name, phone), order_items(*, products(*))").order('created_at', { ascending: false });
    return c.json(data);
});

app.get("/health", (c) => c.json({ status: "ok" }));

serve(app.fetch);
