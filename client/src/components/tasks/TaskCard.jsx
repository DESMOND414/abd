import clsx from "clsx";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  BGS,
  PRIOTITYSTYELS,
  TASK_TYPE,
  formatDate,
} from "../../utils/index.js";
import UserInfo from "../UserInfo.jsx";
import { AddSubTask, TaskAssets, TaskColor, TaskDialog } from "./index";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-full h-fit cosmic-card p-4 rounded">
        <div className="w-full flex justify-between">
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium cosmic-task-card-priority",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className="text-lg text-[#40C4FF]">{ICONS[task?.priority]}</span>
            <span className="uppercase">{task?.priority} Priority</span>
          </div>
          <TaskDialog task={task} />
        </div>
        <>
          <Link to={`/task/${task._id}`}>
            <div className="flex items-center gap-2">
              <TaskColor className={TASK_TYPE[task.stage]} />
              <h4 className="text-lg line-clamp-1 text-[#FFFFFF] font-orbitron cosmic-text-large">
                {task?.title}
              </h4>
            </div>
          </Link>
          <span className="text-sm text-[#CFD8DC]">
            {formatDate(new Date(task?.date))}
          </span>
        </>

        <div className="w-full border-t border-[#546E7A] my-2" />
        <div className="flex items-center justify-between mb-2">
          <TaskAssets
            activities={task?.activities?.length}
            subTasks={task?.subTasks}
            assets={task?.assets?.length}
          />

          <div className="flex flex-row-reverse items-center gap-2">
            {task?.team?.length > 0 &&
              task?.team?.map((m, index) => (
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
            {task?.group && (
              <div className="text-sm text-[#40C4FF] font-semibold font-orbitron">
                Group: {task.group.name}
              </div>
            )}
          </div>
        </div>

        {/* subtasks */}
        {task?.subTasks?.length > 0 ? (
          <div className="py-4 border-t border-[#546E7A]">
            <h5 className="text-base line-clamp-1 text-[#CFD8DC]">
              {task?.subTasks[0].title}
            </h5>

            <div className="p-4 space-x-8">
              <span className="text-sm text-[#CFD8DC]">
                {formatDate(new Date(task?.subTasks[0]?.date))}
              </span>
              <span className="bg-[#40C4FF]/20 px-3 py-1 rounded-full text-[#40C4FF] font-medium">
                {task?.subTasks[0]?.tag}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className="py-4 border-t border-[#546E7A]">
              <span className="text-[#CFD8DC]">No Sub-Task</span>
            </div>
          </div>
        )}

        <div className="w-full pb-2">
          <button
            disabled={user.isAdmin ? false : true}
            onClick={() => setOpen(true)}
            className="w-full flex gap-4 items-center text-sm text-[#CFD8DC] font-semibold disabled:cursor-not-allowed disabled:text-[#546E7A] hover:text-[#40C4FF]"
          >
            <IoMdAdd className="text-lg" />
            <span>ADD SUBTASK</span>
          </button>
        </div>
      </div>

      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </>
  );
};

export default TaskCard;