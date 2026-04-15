import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
    const { name } = await req.json();
    const data = {
        message: `Hello ${name || 'Horizon Customer'}! Welcome to our Edge Functions.`,
    };

    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
    });
});
