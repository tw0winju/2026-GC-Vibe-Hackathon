// 테스트
import express from "express";
import dotenv from "dotenv";
import { supabase } from "./config/supabase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/test-db", async (_req, res) => {
  const { data, error } = await supabase
    .from("your_table")
    .select("*")
    .limit(1);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
