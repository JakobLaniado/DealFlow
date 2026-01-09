import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import supabase from "../config/db";

dotenv.config();

export const requireSellerRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.body.userId;
  console.log("userId", userId);

  const { data: user, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  console.log("userRole", user);

  if (error || !user || user.role !== "seller") {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};
