import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { contractRouter } from "./routes/contract.routes";
import { zoomRouter } from "./routes/zoom.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/zoom", zoomRouter);
app.use("/contracts", contractRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
