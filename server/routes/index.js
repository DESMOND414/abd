import express from "express";
import userRoutes from "./userRoute.js";
import taskRoutes from "./taskRoute.js";
import groupRoutes from "./groupRoute.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/task", taskRoutes);
router.use("/group", groupRoutes);

export default router;
