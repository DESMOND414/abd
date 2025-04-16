import express from "express";
import {
  createGroup,
  getGroups,
  addMember,
  removeMember,
  deleteGroup,
  updateGroupOwner,
} from "../controllers/groupController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protectRoute, createGroup)
  .get(protectRoute, getGroups);

router.route("/:groupId/members")
  .post(protectRoute, addMember);

router.route("/:groupId/members/:memberId")
  .delete(protectRoute,  removeMember);

router.route("/:groupId/owner")
  .put(protectRoute, updateGroupOwner);

router.route("/:groupId")
  .delete(protectRoute, deleteGroup);

export default router;
