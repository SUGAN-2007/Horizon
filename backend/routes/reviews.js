import express from "express";
import { supabase } from "../supabaseClient.js";
import { verifyUser, verifyAdmin } from "../middleware/verifyuser.js";

const router = express.Router();

// [Admin] Get all reviews
router.get("/admin/all", verifyAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("reviews")
            .select(`
                id,
                rating,
                comment,
                created_at,
                user_id,
                product_id,
                profiles (full_name),
                products (title, image)
            `)
            .order("created_at", { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// [Admin] Delete review
router.delete("/admin/:reviewId", verifyAdmin, async (req, res) => {
    try {
        const { error } = await supabase
            .from("reviews")
            .delete()
            .eq("id", req.params.reviewId);
        if (error) throw error;
        res.json({ message: "Review deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

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
                user_id,
                profiles (full_name),
                review_replies (id)
            `)
            .eq("product_id", req.params.productId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        const formatted = data.map(rev => ({
            ...rev,
            name: rev.profiles?.full_name || 'Verified User',
            reply_count: rev.review_replies.length
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get Replies for a review
router.get("/replies/:reviewId", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("review_replies")
            .select(`
                id,
                comment,
                created_at,
                profiles (full_name)
            `)
            .eq("review_id", req.params.reviewId)
            .order("created_at", { ascending: true });

        if (error) throw error;

        const formatted = data.map(rep => ({
            ...rep,
            name: rep.profiles?.full_name || 'User'
        }));
        res.json(formatted);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add a reply
router.post("/reply/add", verifyUser, async (req, res) => {
    const { reviewId, comment } = req.body;
    try {
        const { error } = await req.supabase
            .from("review_replies")
            .insert({
                review_id: reviewId,
                user_id: req.user.id,
                comment
            });
        if (error) throw error;
        res.json({ message: "Reply added" });
    } catch (err) { res.status(500).json({ error: err.message }); }
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
