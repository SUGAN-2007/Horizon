import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTables() {
    console.log("Checking tables...");

    const tables = ['products', 'cart', 'profiles', 'orders', 'order_items'];

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`❌ Table '${table}' check failed: ${error.message}`);
        } else {
            console.log(`✅ Table '${table}' exists.`);
        }
    }
}

checkTables();
