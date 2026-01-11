import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "./config/db";
import { initializeFirebase } from "./config/firebase";
import { contractRouter } from "./routes/contract.routes";
import { meetingRouter } from "./routes/meeting.routes";
import { userRouter } from "./routes/user.routes";

dotenv.config();

// Initialize Firebase Admin for FCM
try {
  initializeFirebase();
} catch (error) {
  console.warn("Firebase not initialized - FCM notifications will not work:", error);
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/meetings", meetingRouter);
app.use("/contracts", contractRouter);
app.use("/users", userRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
