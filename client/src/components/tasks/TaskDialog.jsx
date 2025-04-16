import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { FaExchangeAlt } from "react-icons/fa";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import TaskColor from "./TaskColor";
import { useSelector } from "react-redux";
import AddSubTask from "./AddSubTask";
import { useChangeTaskStageMutation, useUpdateTaskStatusMutation } from "../../redux/slices/api/taskApiSlice";

const CustomTransition = ({ children }) => (
  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    {children}
  </Transition>
);

const ChangeTaskActions = ({ _id, stage, refetch }) => {
  const [changeStage] = useChangeTaskStageMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const handleStageChange = async (stage, id) => {
    const response = await changeStage({ stage, id });
    console.log("Change Stage Response:", response);
    if (response.data.status) {
      await updateTaskStatus({ id, stage });
      console.log("Task status updated in Redux store.");
    }
    if (refetch) {
      refetch();
      console.log("Data refetched after status change.");
    }
  };

  const items = [
    {
      label: "To-Do",
      stage: "todo",
      icon: <TaskColor className="bg-[#40C4FF]" />,
      onClick: () => handleStageChange("todo", _id),
    },
    {
      label: "In Progress",
      stage: "in progress",
      icon: <TaskColor className="bg-[#FFCA28]" />,
      onClick: () => handleStageChange("in progress", _id),
    },
    {
      label: "Completed",
      stage: "completed",
      icon: <TaskColor className="bg-[#26A69A]" />,
      onClick: () => handleStageChange("completed", _id),
    },
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className={clsx(
          "inline-flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-[#CFD8DC] hover:text-[#40C4FF] cosmic-dropdown-menu"
        )}
      >
        <FaExchangeAlt />
        <span>Change Task</span>
      </Menu.Button>

      <CustomTransition>
        <Menu.Items className="absolute p-4 left-0 mt-2 w-40 divide-y divide-[#546E7A] rounded-md bg-[#252A36] shadow-lg ring-1 ring-[#40C4FF]/20 focus:outline-none">
          <div className="px-1 py-1 space-y-2">
            {items.map((el) => (
              <Menu.Item key={el.label} disabled={stage === el.stage}>
                {({ active }) => (
                  <button
                    disabled={stage === el.stage}
                    onClick={el?.onClick}
                    className={clsx(
                      active ? "bg-[#40C4FF]/20 text-[#FFFFFF]" : "text-[#CFD8DC]",
                      "group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-50 font-orbitron"
                    )}
                  >
                    {el.icon}
                    {el.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </CustomTransition>
    </Menu>
  );
};

export default function TaskDialog({ task }) {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const refetch = () => {};
  const items = [
    {
      label: "Open Task",
      icon: (
        <AiTwotoneFolderOpen
          className="mr-2 h-5 w-5 text-[#CFD8DC]"
          aria-hidden="true"
        />
      ),
      onClick: () => navigate(`/task/${task._id}`),
    },
    {
      label: "Add Sub-Task",
      icon: <MdAdd className="mr-2 h-5 w-5 text-[#CFD8DC]" aria-hidden="true" />,
      onClick: () => setOpen(true),
    },
    {
      label: "Duplicate",
      icon: (
        <HiDuplicate className="mr-2 h-5 w-5 text-[#CFD8DC]" aria-hidden="true" />
      ),
      onClick: () => console.log("Duplicate task"),
    },
    {
      label: "Delete Task",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 h-5 w-5 text-[#CFD8DC]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      onClick: async () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
          try {
            const response = await fetch(`/api/task/delete-restore/${task._id}?actionType=delete`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (response.ok) {
              alert("Task deleted successfully.");
              window.location.reload();
            } else {
              alert("Failed to delete task.");
            }
          } catch (error) {
            alert("Error deleting task: " + error.message);
          }
        }
      },
    },
  ];

  return (
    <div className="">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-[#CFD8DC] hover:text-[#40C4FF] cosmic-dropdown-menu">
          <BsThreeDots />
        </Menu.Button>

        <CustomTransition>
          <Menu.Items className="absolute p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-[#546E7A] rounded-md bg-[#252A36] shadow-lg ring-1 ring-[#40C4FF]/20 focus:outline-none">
            <div className="px-1 py-1 space-y-2">
              {items.map((el, index) => (
                <Menu.Item key={el.label}>
                  {({ active }) => (
                    <button
                      disabled={index === 0 ? false : !user.isAdmin}
                      onClick={el?.onClick}
                      className={clsx(
                        active ? "bg-[#40C4FF]/20 text-[#FFFFFF]" : "text-[#CFD8DC]",
                        "group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:text-[#546E7A] font-orbitron"
                      )}
                    >
                      {el.icon}
                      {el.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>

            <div className="px-1 py-1">
              <Menu.Item>
                <ChangeTaskActions id={task._id} {...task} refetch={refetch} />
              </Menu.Item>
            </div>
          </Menu.Items>
        </CustomTransition>
      </Menu>

      <AddSubTask open={open} setOpen={setOpen} />
    </div>
  );
}