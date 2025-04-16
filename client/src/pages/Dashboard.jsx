import clsx from "clsx";
import moment from "moment";
import React, { useEffect } from "react";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { LuClipboardEdit } from "react-icons/lu";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { Loading, UserInfo } from "../components";
import { useGetDasboardStatsQuery } from "../redux/slices/api/taskApiSlice";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import { useSelector } from "react-redux";

const Card = ({ label, count, bg, icon }) => {
  return (
    <div className="w-full h-32 bg-[#252A36] p-5 shadow-md rounded-md flex items-center justify-between cosmic-card">
      <div className="h-full flex flex-1 flex-col justify-between">
        <p className="text-base text-[#CFD8DC]">{label}</p>
        <span className="text-2xl font-semibold text-white">{count}</span>
        <span className="text-sm text-[#90A4AE]">{"111 last month"}</span>
      </div>
      <div
        className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center text-white",
          bg
        )}
      >
        {icon}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { data, isLoading, error } = useGetDasboardStatsQuery();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const totals = data?.tasks || [];

  if (isLoading)
    return (
      <div className="py-10 cosmic-container">
        <Loading />
      </div>
    );

  const stats = [
    {
      _id: "1",
      label: "TOTAL MISSIONS",
      total: data?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#40C4FF]",
    },
    {
      _id: "2",
      label: "ORBIT ACHIEVED",
      total: totals["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#26A69A]",
    },
    {
      _id: "3",
      label: "IN ORBIT",
      total: totals["in progress"] || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-[#FFCA28]",
    },
    {
      _id: "4",
      label: "LAUNCH PAD",
      total: totals["todo"],
      icon: <FaArrowsToDot />,
      bg: "bg-[#EF5350]",
    },
  ];

  return (
    <div className="h-full py-4 cosmic-container">
      <div className="space-y-8">
        {/* Cards: Stacked Vertically */}
        <div className="flex flex-col gap-5">
          {stats?.map(({ icon, bg, label, total }, index) => (
            <Card key={index} icon={icon} bg={bg} label={label} count={total} />
          ))}
        </div>

        {/* Tables: Grid Layout */}
        <div className="grid grid-cols-1 gap-5">
          {data && <TaskTable tasks={data?.last10Task} />}
          {data && user?.isAdmin && <UserTable users={data?.users} />}
        </div>
      </div>
    </div>
  );
};

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead className="border-b border-[#546E7A]">
      <tr className="text-white text-left">
        <th className="py-2">Crew Member</th>
        <th className="py-2">Status</th>
        <th className="py-2">Joined At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-[#546E7A] text-[#CFD8DC] hover:bg-[#546E7A]/20">
      <td className="py-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-[#40C4FF]">
            <span className="text-center">{getInitials(user?.name)}</span>
          </div>
          <div>
            <p className="text-white">{user.name}</p>
            <span className="text-xs text-[#CFD8DC]">{user?.role}</span>
          </div>
        </div>
      </td>

      <td>
        <p
          className={clsx(
            "w-fit px-3 py-1 rounded-full text-sm",
            user?.isActive ? "bg-[#40C4FF]/20 text-[#40C4FF]" : "bg-[#FFCA28]/20 text-[#FFCA28]"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </p>
      </td>
      <td className="py-2 text-sm">{moment(user?.createdAt).fromNow()}</td>
    </tr>
  );

  return (
    <div className="w-full bg-[#252A36] h-fit px-2 md:px-6 py-4 shadow-md rounded cosmic-card">
      <table className="w-full mb-5">
        <TableHeader />
        <tbody>
          {users?.map((user, index) => (
            <TableRow key={index + user?._id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TaskTable = ({ tasks }) => {
  const { user } = useSelector((state) => state.auth);

  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className="border-b border-[#546E7A]">
      <tr className="text-white text-left">
        <th className="py-2">Mission Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2">Crew</th>
        <th className="py-2 hidden md:block">Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-[#546E7A] text-[#CFD8DC] hover:bg-[#546E7A]/20">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />
          <p className="text-base text-white">{task?.title}</p>
        </div>
      </td>
      <td className="py-2">
        <div className="flex gap-1 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span className="capitalize text-[#CFD8DC]">{task?.priority}</span>
        </div>
      </td>

      <td className="py-2">
        <div className="flex">
          {task?.team.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS?.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>

      <td className="py-2 hidden md:block">
        <span className="text-base text-[#CFD8DC]">
          {moment(task?.date).fromNow()}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="w-full bg-[#252A36] px-2 md:px-4 pt-4 pb-4 shadow-md rounded cosmic-card">
      <table className="w-full">
        <TableHeader />
        <tbody className="">
          {tasks.map((task, id) => (
            <TableRow key={task?._id + id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;