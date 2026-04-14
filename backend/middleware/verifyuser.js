import { createClient } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient.js";

export const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "No token provided" });

  // Create a per-request client with the user's JWT
  const personatedSupabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const { data, error } = await personatedSupabase.auth.getUser();

  if (error)
    return res.status(401).json({ error: "Invalid token" });

  req.user = data.user;
  req.supabase = personatedSupabase; // Attach the personated client
  next();
};

export const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "No token provided" });

  // Create a personated client for the admin request
  const personatedSupabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const { data, error } = await personatedSupabase.auth.getUser();
  if (error) return res.status(401).json({ error: "Invalid token" });

  const { data: profile, error: profileError } = await personatedSupabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    console.warn("Admin Verify Failed for user:", data.user?.id, "Error:", profileError?.message);
    return res.status(403).json({ error: "Access denied. Admin role required." });
  }

  console.log("Admin Verify Success for user:", data.user?.id);
  req.user = data.user;
  req.supabase = personatedSupabase;
  next();
};
