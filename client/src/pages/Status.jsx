import React from "react";
import { useGetUserTaskStatusQuery } from "../redux/slices/api/userApiSlice";
import { countTasksByStage, getInitials } from "../utils";
import { Loading, Title } from "../components";

const StatusPage = () => {
  const { data, isLoading } = useGetUserTaskStatusQuery();

  if (isLoading)
    return (
      <div className="py-10 cosmic-container">
        <Loading />
      </div>
    );

  const TableHeader = () => (
    <thead className="border-b border-[#546E7A]">
      <tr className="text-[#FFFFFF] text-left">
        <th className="py-2">Full Name</th>
        <th className="py-2">Title</th>
        <th className="py-2">Task Progress</th>
        <th className="py-2">Task Numbers</th>
        <th className="py-2">Total Task</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => {
    const counts = countTasksByStage(user?.tasks);

    return (
      <tr className="border-b border-[#546E7A] text-[#CFD8DC] hover:bg-[#546E7A]/20">
        <td className="p-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-[#40C4FF]">
              <span className="text-xs md:text-sm text-center">
                {getInitials(user.name)}
              </span>
            </div>
            <span className="text-white">{user.name}</span>
          </div>
        </td>
        <td className="p-2">{user.title}</td>
        <td className="p-2">
          <div className="flex items-center gap-2 text-white text-sm">
            <p className="px-2 py-1 bg-[#40C4FF]/80 rounded">
              {(counts.inProgress * 100).toFixed(1)}%
            </p>
            <p className="px-2 py-1 bg-[#FFCA28]/80 rounded">
              {(counts.todo * 100).toFixed(1)}%
            </p>
            <p className="px-2 py-1 bg-[#26A69A]/80 rounded">
              {(counts.completed * 100).toFixed(1)}%
            </p>
          </div>
        </td>
        <td className="p-2">
          <div className="flex items-center gap-3 text-[#CFD8DC]">
            <span>{counts.inProgress}</span> {" | "}
            <span>{counts.todo}</span> {" | "}
            <span>{counts.completed}</span>
          </div>
        </td>
        <td className="p-2">
          <span>{user?.tasks?.length}</span>
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full md:px-1 px-0 mb-6 cosmic-container">
      <div className="flex items-center justify-between mb-8">
        <Title title="User Task Status" className="text-[#FFFFFF] drop-shadow-[0_1px_3px_rgba(64,196,255,0.5)]" />
      </div>
      <div className="bg-[#252A36] px-2 md:px-4 py-4 shadow-md rounded cosmic-card">
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
  );
};

export default StatusPage;