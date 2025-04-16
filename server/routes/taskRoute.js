import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateSubTaskStage,
  updateTask,
  updateTaskStage,
} from "../controllers/taskController.js";
import { protectRoute, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, createTask);
router.post("/duplicate/:id", protectRoute, isAdmin, duplicateTask);
router.post("/activity/:id", protectRoute, postTaskActivity);

router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getTasks);
router.get("/:id", protectRoute, getTask);
  
router.put("/create-subtask/:id", protectRoute, createSubTask);
router.put("/update/:id", protectRoute, updateTask);
router.put("/change-stage/:id", protectRoute, updateTaskStage);
router.put(
  "/change-status/:taskId/:subTaskId",
  protectRoute,
  updateSubTaskStage
);
router.put("/:id", protectRoute, trashTask);
  
router.delete("/delete-restore/:id?", protectRoute, deleteRestoreTask);
  
  
  
  
  

export default router;
