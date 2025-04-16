import express from "express";
import {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  getUserTaskStatus,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { protectRoute, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", protectRoute, isAdmin, registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/get-team", protectRoute, getTeamList);
router.get("/notifications", protectRoute, getNotificationsList);
router.get("/get-status", protectRoute, getUserTaskStatus);

router.put("/profile", protectRoute,  updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);
router.put("/change-password", protectRoute, changeUserPassword);
//   FOR ADMIN ONLY - ADMIN ROUTES
router
    .route("/:id")
    .put(protectRoute, activateUserProfile)
    .delete(protectRoute, deleteUserProfile);

export default router;
