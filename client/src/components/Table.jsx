import clsx from "clsx";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils/index.js";
import { UserInfo } from "./index";
import { TaskAssets, TaskColor } from "./tasks";
import { Link } from "react-router-dom";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }) => {
  const TableHeader = () => (
    <thead className="w-full border-b border-[#546E7A]">
      <tr className="w-full text-[#FFFFFF] text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2 line-clamp-1">Created At</th>
        <th className="py-2">Assets</th>
        <th className="py-2">Team</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-[#546E7A] text-[#CFD8DC] hover:bg-[#546E7A]/20">
      <td className="py-2">
        <Link to={`/task/${task._id}`}>
          <div className="flex items-center gap-2">
            <TaskColor className={TASK_TYPE[task.stage]} />
            <p className="w-full line-clamp-2 text-base text-[#FFFFFF]">
              {task?.title}
            </p>
          </div>
        </Link>
      </td>

      <td className="py-2">
        <div className="flex gap-1 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span className="capitalize line-clamp-1">
            {task?.priority} Priority
          </span>
        </div>
      </td>

      <td className="py-2">
        <span className="text-sm text-[#CFD8DC]">
          {formatDate(new Date(task?.date))}
        </span>
      </td>

      <td className="py-2">
        <TaskAssets
          activities={task?.activities?.length}
          subTasks={task?.subTasks}
          assets={task?.assets?.length}
        />
      </td>

      <td className="py-2">
        <div className="flex">
          {task?.team?.map((m, index) => (
            <div
              key={m._id}
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
    </tr>
  );

  return (
    <div className="bg-[#252A36] px-2 md:px-4 pt-4 pb-9 shadow-md rounded cosmic-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody>
            {tasks.map((task, index) => (
              <TableRow key={index} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;