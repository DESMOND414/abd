import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  AddUser,
  Button,
  ConfirmatioDialog,
  Loading,
  Title,
  UserAction,
} from "../components";
import {
  useDeleteUserMutation,
  useGetTeamListsQuery,
  useUserActionMutation,
} from "../redux/slices/api/userApiSlice";
import { getInitials } from "../utils/index";
import { useSearchParams } from "react-router-dom";

const Users = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || "");

  const { data, isLoading, refetch } = useGetTeamListsQuery({
    search: searchTerm,
  });
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  const userStatusClick = (el) => {
    setSelected(el);
    setOpenAction(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteUser(selected);
      refetch();
      console.log("User deleted successfully:", res?.data?.message);
      setSelected(null);
      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
    } catch (error) {
      console.error("Error deleting user:", error?.data?.message || error.error);
    }
  };

  const userActionHandler = async () => {
    try {
      const res = await userAction({
        isActive: !selected?.isActive,
        id: selected?._id,
      });
      refetch();
      console.log("User status updated successfully:", res?.data?.message);
      setSelected(null);
      setTimeout(() => {
        setOpenAction(false);
      }, 500);
    } catch (error) {
      console.error("Error updating user status:", error?.data?.message || error.error);
    }
  };

  useEffect(() => {
    refetch();
  }, [open]);

  const TableHeader = () => (
    <thead className="border-b border-[#546E7A]">
      <tr className="text-[#FFFFFF] text-left">
        <th className="py-2">Crew Member</th>
        <th className="py-2">Title</th>
        <th className="py-2">Email</th>
        <th className="py-2">Role</th>
        <th className="py-2">Status</th>
        <th className="py-2"></th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-[#546E7A] text-[#CFD8DC] hover:bg-[#546E7A]/20 cosmic-table-row">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-[#40C4FF]">
            <span className="text-xs md:text-sm text-center">
              {getInitials(user.name)}
            </span>
          </div>
          <span className="text-[#FFFFFF]">{user.name}</span>
        </div>
      </td>
      <td className="p-2">{user.title}</td>
      <td className="p-2">{user.email}</td>
      <td className="p-2">{user.role}</td>
      <td>
        <button
          onClick={() => userStatusClick(user)}
          className={clsx(
            "w-fit px-4 py-1 rounded-full font-semibold",
            user?.isActive ? "bg-[#40C4FF]/20 text-[#40C4FF]" : "bg-[#FFCA28]/20 text-[#FFCA28]"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </button>
      </td>
      <td className="p-2 flex gap-4 justify-end">
        <Button
          className="text-[#40C4FF] hover:text-[#26A69A] font-semibold sm:px-0"
          label="Edit"
          type="button"
          onClick={() => editClick(user)}
        />
        <Button
          className="text-[#EF5350] hover:text-[#D81B60] font-semibold sm:px-0"
          label="Delete"
          type="button"
          onClick={() => deleteClick(user?._id)}
        />
      </td>
    </tr>
  );

  return isLoading ? (
    <div className="py-10 cosmic-container">
      <Loading />
    </div>
  ) : (
    <>
      <div className="w-full md:px-1 px-0 mb-6 cosmic-container">
        <div className="flex items-center justify-between mb-8">
          <Title
            title="Crew Members"
            className="text-[#FFFFFF] drop-shadow-[0_1px_3px_rgba(64,196,255,0.5)]"
          />

          <Button
            label="Add New Crew Member"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-[#40C4FF] text-[#252A36] rounded-md 2xl:py-2.5 hover:bg-[#26A69A] transition-colors font-orbitron cosmic-button-glow"
            onClick={() => setOpen(true)}
          />
        </div>
        <div className="bg-[#252A36] px-2 md:px-4 py-4 shadow rounded cosmic-card">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {data?.map((user, index) => (
                  <TableRow key={index} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
};

export default Users;