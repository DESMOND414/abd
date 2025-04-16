import React, { useEffect, useState } from "react"; 
import { useSelector } from "react-redux";
import axios from "axios";

const Groups = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMembers, setSelectedMembers] = useState({});
  const [selectedOwners, setSelectedOwners] = useState({});
  const [updatedOwners, setUpdatedOwners] = useState({});

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.get("/api/group", config);
      setGroups(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!user.isAdmin) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.get("/api/user/get-team", config);
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post(
        "/api/group",
        { name: newGroupName },
        config
      );
      setNewGroupName("");
      fetchGroups();
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const handleAddMember = async (groupId) => {
    const memberId = selectedMembers[groupId];
    if (!memberId) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post(
        `/api/group/${groupId}/members`,
        { memberId },
        config
      );
      setSelectedMembers((prev) => ({ ...prev, [groupId]: "" }));
      fetchGroups();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleRemoveMember = async (groupId, memberId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`/api/group/${groupId}/members/${memberId}`, config);
      fetchGroups();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleChangeOwner = async (groupId) => {
    const newOwnerId = selectedOwners[groupId];
    if (!newOwnerId) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.put(
        `/api/group/${groupId}/owner`,
        { newOwnerId },
        config
      );
      setSelectedOwners((prev) => ({ ...prev, [groupId]: "" }));
      setUpdatedOwners((prev) => ({ ...prev, [groupId]: true }));
      fetchGroups();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // ✅ This is the missing function you need to delete groups
  const handleDeleteGroup = async (groupId) => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`/api/group/${groupId}`, config);
      fetchGroups(); // Refresh list after deletion
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="cosmic-container p-4">
      <h1 className="text-white text-2xl mb-4">Groups</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {user && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="New group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="p-2 rounded bg-[#1A1F2B] text-white flex-1"
          />
          <button
            onClick={handleCreateGroup}
            className="bg-[#40C4FF] px-4 rounded text-[#252A36]"
          >
            Create
          </button>
        </div>
      )}
      {loading ? (
        <p className="text-white">Loading groups...</p>
      ) : groups.length === 0 ? (
        <p className="text-white">No groups found.</p>
      ) : (
        groups.map((group) => (
          <div
            key={group._id}
            className="bg-[#252A36] p-4 rounded mb-4 text-white"
          >
            <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
            <p className="mb-2">
              Owner:{" "}
              {group.owner._id === user._id
                ? "You"
                : group.owner.name || group.owner}
            </p>
            {group.owner._id === user._id && (
              <div className="mb-2 flex items-center gap-2">
                <select
                  value={selectedOwners[group._id] || ""}
                  onChange={(e) =>
                    setSelectedOwners((prev) => ({
                      ...prev,
                      [group._id]: e.target.value,
                    }))
                  }
                  className="p-1 rounded bg-[#1A1F2B] text-white"
                >
                  <option value="">Change Owner</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleChangeOwner(group._id)}
                  className="ml-2 bg-[#40C4FF] px-2 rounded text-[#252A36]"
                >
                  Update
                </button>
                {group.owner._id === user._id  && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete the group "${group.name}"?`
                        )
                      ) {
                        handleDeleteGroup(group._id);
                      }
                    }}
                    className="ml-2 bg-red-600 px-2 rounded text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-1">Members:</h3>
              <ul>
                {group.members.map((member) => (
                  <li
                    key={member._id}
                    className="flex justify-between items-center"
                  >
                    <span>{member.name}</span>
                    {group.owner._id === user._id && member._id !== user._id && (
                      <button
                        onClick={() => handleRemoveMember(group._id, member._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {group.owner._id === user._id && (
                <div className="mt-2 flex gap-2">
                  <select
                    value={selectedMembers[group._id] || ""}
                    onChange={(e) =>
                      setSelectedMembers((prev) => ({
                        ...prev,
                        [group._id]: e.target.value,
                      }))
                    }
                    className="p-1 rounded bg-[#1A1F2B] text-white flex-1"
                  >
                    <option value="">Add Member</option>
                    {users
                      .filter((u) => !group.members.some((m) => m._id === u._id))
                      .map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => handleAddMember(group._id)}
                    className="bg-[#40C4FF] px-2 rounded text-[#252A36]"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Groups;
