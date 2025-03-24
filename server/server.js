import "dotenv/config";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", process.env.SUPABASE_URL],
      },
    },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.static(path.join(__dirname, "dist")));

const supabaseProxy = createProxyMiddleware({
  target: process.env.SUPABASE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/supabase": "",
  },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader("apikey", process.env.SUPABASE_ANON_KEY);
    proxyReq.setHeader(
      "Authorization",
      `Bearer ${process.env.SUPABASE_ANON_KEY}`
    );
    proxyReq.removeHeader("apikey");
    proxyReq.removeHeader("Authorization");
  },
  onProxyRes: (proxyRes) => {
    delete proxyRes.headers["apikey"];
    delete proxyRes.headers["authorization"];
  },
});

app.use("/supabase", supabaseProxy);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Supabase proxy active at /supabase`);
});
