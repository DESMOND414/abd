import asyncHandler from "express-async-handler";
import Group from "../models/Group.js";
import User from "../models/userModel.js";

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
const createGroup = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  const user = await User.findById(userId);

  // Check if the user exists
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!name) {
    res.status(400);
    throw new Error("Group name is required");
  }

  const group = new Group({
    name,
    owner: user._id, // Set the owner to the user's _id
    members: [userId],
  });

  const createdGroup = await group.save();
  res.status(201).json(createdGroup);
});

const getGroups = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const groups = await Group.find({
    members: userId,
  })
    .populate("members", "name email")
    .populate("owner", "name email");
  res.json(groups);
});

const addMember = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { memberId } = req.body;
  const userId = req.user.userId;

  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404);
    throw new Error("Group not found");
  }

  if (group.members.includes(memberId)) {
    res.status(400);
    throw new Error("Member already in group");
  }

  group.members.push(memberId);
  await group.save();

  res.json(group);
});

const removeMember = asyncHandler(async (req, res) => {
  const { groupId, memberId } = req.params;
  const userId = req.user.userId;

  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404);
    throw new Error("Group not found");
  }

  group.members = group.members.filter(
    (m) => m.toString() !== memberId.toString()
  );
  await group.save();

  res.json(group);
});

const updateGroupOwner = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { newOwnerId } = req.body;
  const userId = req.user.userId;

  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404);
    throw new Error("Group not found");
  }

  const newOwner = await User.findById(newOwnerId);
  if (!newOwner) {
    res.status(404);
    throw new Error("New owner user not found");
  }

  group.owner = newOwnerId;

  if (!group.members.includes(newOwnerId)) {
    group.members.push(newOwnerId);
  }

  await group.save();

  res.json(group);
});

const deleteGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.userId;

  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404);
    throw new Error("Group not found");
  }

  await Group.deleteOne({ _id: groupId });

  res.json({ message: "Group deleted" });
});

export {
  createGroup,
  getGroups,
  addMember,
  removeMember,
  updateGroupOwner,
  deleteGroup,
};
