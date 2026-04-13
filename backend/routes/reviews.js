import express from "express";
import { supabase } from "../supabaseClient.js";
import { verifyUser } from "../middleware/verifyuser.js";

const router = express.Router();

// Get reviews for a product
router.get("/:productId", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("reviews")
            .select(`
                id,
                rating,
                comment,
                created_at,
                profiles (full_name)
            `)
            .eq("product_id", req.params.productId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a review
router.post("/add", verifyUser, async (req, res) => {
    const { productId, rating, comment } = req.body;
    const pId = parseInt(productId);

    try {
        // Insert review
        const { error: reviewError } = await req.supabase
            .from("reviews")
            .insert({
                user_id: req.user.id,
                product_id: pId,
                rating,
                comment
            });

        if (reviewError) throw reviewError;

        // Update product rating cache
        const { data: allReviews } = await supabase
            .from("reviews")
            .select("rating")
            .eq("product_id", pId);

        const count = allReviews.length;
        const avg = count > 0 ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1) : 0;

        await supabase
            .from("products")
            .update({ rating_rate: parseFloat(avg), rating_count: count })
            .eq("id", pId);

        res.json({ message: "Review added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
