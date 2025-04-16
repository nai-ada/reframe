export async function handler(event, context) {
  const secret1 = process.env.VITE_GEMINI_API_KEY;
  const secret2 = process.env.VITE_SUPABASE_URL;
  const secret3 = process.env.VITE_SUPABASE_ANON_KEY;

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Netlify function ran successfully" }),
  };
}
