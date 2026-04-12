import { supabase } from "../supabaseClient.js";

export const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "No token provided" });

  const { data, error } = await supabase.auth.getUser(token);

  if (error)
    return res.status(401).json({ error: "Invalid token" });

  req.user = data.user;
  next();
};

export const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "No token provided" });

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: "Invalid token" });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profile?.role !== 'admin') {
    return res.status(403).json({ error: "Access denied. Admin role required." });
  }

  req.user = data.user;
  next();
};
