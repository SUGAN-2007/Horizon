import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkOrders() {
    console.log("Fetching recent orders...");
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                id, product_id, quantity, size
            )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("❌ Error fetching orders:", error);
    } else {
        console.log("✅ Recent Orders:", JSON.stringify(data, null, 2));
    }
}

checkOrders();
