import clsx from "clsx";
import moment from "moment";
import React, { useState } from "react";
import { FaBug, FaSpinner, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { Button, Loading, Tabs } from "../components";
import { TaskColor } from "../components/tasks";
import {
  useChangeSubTaskStatusMutation,
  useGetSingleTaskQuery,
  usePostTaskActivityMutation,
} from "../redux/slices/api/taskApiSlice";
import {
  PRIOTITYSTYELS,
  TASK_TYPE,
  getCompletedSubTasks,
  getInitials,
} from "../utils";

const assets = [
  "https://images.pexels.com/photos/2418664/pexels-photo-2418664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/8797307/pexels-photo-8797307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2534523/pexels-photo-2534523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/804049/pexels-photo-804049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-[#EF5350]/20",
  medium: "bg-[#FFCA28]/20",
  low: "bg-[#40C4FF]/20",
};

const TABS = [
  { title: "Mission Details", icon: <FaTasks /> },
  { title: "Mission Log", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  commented: (
    <div className="w-10 h-10 rounded-full bg-[#546E7A] flex items-center justify-center text-white">
      <MdOutlineMessage />
    </div>
  ),
  started: (
    <div className="w-10 h-10 rounded-full bg-[#40C4FF] flex items-center justify-center text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#546E7A] text-white">
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className="text-[#EF5350]">
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className="w-10 h-10 rounded-full bg-[#26A69A] flex items-center justify-center text-white">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#AB47BC] text-white">
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Orbit",
  "Commented",
  "Bug",
  "Assigned",
];

const Activities = ({ activity, id, refetch }) => {
  const [selected, setSelected] = useState("Started");
  const [text, setText] = useState("");

  const [postActivity, { isLoading }] = usePostTaskActivityMutation();

  const handleSubmit = async () => {
    try {
      const data = {
        type: selected?.toLowerCase(),
        activity: text,
      };
      const res = await postActivity({
        data,
        id,
      }).unwrap();
      setText("");
      console.log("Activity posted successfully:", res?.message);
      refetch();
    } catch (err) {
      console.error("Error posting activity:", err?.data?.message || err.error);
    }
  };

  const Card = ({ item }) => {
    return (
      <div className="flex space-x-4">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center">
            {TASKTYPEICON[item?.type]}
          </div>
          <div className="h-full flex items-center">
            <div className="w-0.5 bg-[#546E7A] h-full"></div>
          </div>
        </div>

        <div className="flex flex-col gap-y-1 mb-8">
          <p className="font-semibold text-[#FFFFFF]">{item?.by?.name}</p>
          <div className="text-[#CFD8DC] space-x-2">
            <span className="capitalize">{item?.type}</span>
            <span className="text-sm">{moment(item?.date).fromNow()}</span>
          </div>
          <div className="text-[#CFD8DC]">{item?.activity}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-[#252A36] shadow rounded-md justify-between overflow-y-auto cosmic-card">
      <div className="w-full md:w-1/2">
        <h4 className="text-[#FFFFFF] font-semibold text-lg mb-5 font-orbitron">
          Mission Log
        </h4>
        <div className="w-full space-y-0">
          {activity?.map((item, index) => (
            <Card
              key={item.id}
              item={item}
              isConnected={index < activity?.length - 1}
            />
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/3">
        <h4 className="text-[#FFFFFF] font-semibold text-lg mb-5 font-orbitron">
          Add Log Entry
        </h4>
        <div className="w-full flex flex-wrap gap-5">
          {act_types.map((item, index) => (
            <div key={item} className="flex gap-2 items-center">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#40C4FF]"
                checked={selected === item}
                onChange={() => setSelected(item)}
              />
              <p className="text-[#CFD8DC]">{item}</p>
            </div>
          ))}
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Log Entry..."
            className="bg-[#1A1F2B] w-full mt-10 border border-[#546E7A] outline-none p-4 rounded-md focus:ring-2 ring-[#40C4FF] text-[#CFD8DC] placeholder-[#90A4AE]"
          ></textarea>
          {isLoading ? (
            <Loading />
          ) : (
            <Button
              type="button"
              label="Submit Log"
              onClick={handleSubmit}
              className="bg-[#40C4FF] text-[#252A36] rounded font-orbitron hover:bg-[#26A69A] transition-colors"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const TaskDetail = () => {
  const { id } = useParams();
  const { data, isLoading, refetch } = useGetSingleTaskQuery(id);
  const [subTaskAction, { isLoading: isSubmitting }] =
    useChangeSubTaskStatusMutation();

  const [selected, setSelected] = useState(0);
  const task = data?.task || [];

  const handleSubmitAction = async (el) => {
    try {
      const data = {
        id: el.id,
        subId: el.subId,
        status: !el.status,
      };
      const res = await subTaskAction({
        ...data,
      }).unwrap();
      console.log("Subtask status updated successfully:", res?.message);
      refetch();
    } catch (err) {
      console.error("Error updating subtask status:", err?.data?.message || err.error);
    }
  };

  if (isLoading)
    return (
      <div className="py-10 cosmic-container">
        <Loading />
      </div>
    );

  const percentageCompleted =
    task?.subTasks?.length === 0
      ? 0
      : (getCompletedSubTasks(task?.subTasks) / task?.subTasks?.length) * 100;

  return (
    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden cosmic-container">
      {/* Mission Details */}
      <h1 className="text-2xl text-[#FFFFFF] font-bold font-orbitron drop-shadow-[0_1px_3px_rgba(64,196,255,0.5)]">
        {task?.title}
      </h1>
      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <>
            <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-[#252A36] shadow rounded-md px-8 py-8 overflow-y-auto cosmic-card">
              <div className="w-full md:w-1/2 space-y-8">
                <div className="flex items-center gap-5">
                  <div
                    className={clsx(
                      "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                      PRIOTITYSTYELS[task?.priority],
                      bgColor[task?.priority]
                    )}
                  >
                    <span className="text-lg">{ICONS[task?.priority]}</span>
                    <span className="uppercase text-[#252A36]">
                      {task?.priority} Priority
                    </span>
                  </div>

                  <div className={clsx("flex items-center gap-2")}>
                    <TaskColor className={TASK_TYPE[task?.stage]} />
                    <span className="text-[#FFFFFF] uppercase">
                      {task?.stage === "todo"
                        ? "Launch Pad"
                        : task?.stage === "in progress"
                        ? "In Orbit"
                        : task?.stage === "completed"
                        ? "Orbit Achieved"
                        : task?.stage}
                    </span>
                  </div>
                </div>

                <p className="text-[#CFD8DC]">
                  Launched At: {new Date(task?.date).toDateString()}
                </p>

                <div className="flex items-center gap-8 p-4 border-y border-[#546E7A]">
                  <div className="space-x-2">
                    <span className="font-semibold text-[#FFFFFF]">Assets:</span>
                    <span className="text-[#CFD8DC]">{task?.assets?.length}</span>
                  </div>
                  <span className="text-[#90A4AE]">|</span>
                  <div className="space-x-2">
                    <span className="font-semibold text-[#FFFFFF]">Sub-Missions:</span>
                    <span className="text-[#CFD8DC]">{task?.subTasks?.length}</span>
                  </div>
                </div>

                <div className="space-y-4 py-6">
                  <p className="text-[#CFD8DC] font-semibold text-sm font-orbitron">
                    MISSION CREW
                  </p>
                  <div className="space-y-3">
                    {task?.team?.map((m, index) => (
                      <div
                        key={index + m?._id}
                        className="flex gap-4 py-2 items-center border-t border-[#546E7A]"
                      >
                        <div
                          className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm bg-[#40C4FF]"
                        >
                          <span className="text-center">
                            {getInitials(m?.name)}
                          </span>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-[#FFFFFF]">{m?.name}</p>
                          <span className="text-[#CFD8DC]">{m?.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {task?.subTasks?.length > 0 && (
                  <div className="space-y-4 py-6">
                    <div className="flex items-center gap-5">
                      <p className="text-[#CFD8DC] font-semibold text-sm font-orbitron">
                        SUB-MISSIONS
                      </p>
                      <div
                        className={clsx(
                          "w-fit h-8 px-2 rounded-full flex items-center justify-center text-white",
                          percentageCompleted < 50
                            ? "bg-[#EF5350]"
                            : percentageCompleted < 80
                            ? "bg-[#FFCA28]"
                            : "bg-[#26A69A]"
                        )}
                      >
                        <p>{percentageCompleted.toFixed(2)}%</p>
                      </div>
                    </div>
                    <div className="space-y-8">
                      {task?.subTasks?.map((el, index) => (
                        <div key={index + el?._id} className="flex gap-3">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#AB47BC]/20">
                            <MdTaskAlt className="text-[#AB47BC]" size={26} />
                          </div>

                          <div className="space-y-1">
                            <div className="flex gap-2 items-center">
                              <span className="text-sm text-[#CFD8DC]">
                                {new Date(el?.date).toDateString()}
                              </span>

                              <span className="px-2 py-0.5 text-center text-sm rounded-full bg-[#AB47BC]/20 text-[#AB47BC] font-semibold lowercase">
                                {el?.tag}
                              </span>

                              <span
                                className={clsx(
                                  "px-2 py-0.5 text-center text-sm rounded-full font-semibold",
                                  el?.isCompleted
                                    ? "bg-[#26A69A]/20 text-[#26A69A]"
                                    : "bg-[#FFCA28]/20 text-[#FFCA28]"
                                )}
                              >
                                {el?.isCompleted ? "done" : "in progress"}
                              </span>
                            </div>
                            <p className="text-[#CFD8DC] pb-2">{el?.title}</p>

                            <button
                              disabled={isSubmitting}
                              className={clsx(
                                "text-sm outline-none bg-[#1A1F2B] text-[#CFD8DC] p-1 rounded",
                                el?.isCompleted
                                  ? "hover:bg-[#EF5350]/20 hover:text-[#EF5350]"
                                  : "hover:bg-[#26A69A]/20 hover:text-[#26A69A]",
                                "disabled:cursor-not-allowed"
                              )}
                              onClick={() =>
                                handleSubmitAction({
                                  status: el?.isCompleted,
                                  id: task?._id,
                                  subId: el?._id,
                                })
                              }
                            >
                              {isSubmitting ? (
                                <FaSpinner className="animate-spin" />
                              ) : el?.isCompleted ? (
                                "Mark as Undone"
                              ) : (
                                "Mark as Done"
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/2 space-y-3">
                {task?.description && (
                  <div className="mb-10">
                    <p className="text-lg font-semibold text-[#FFFFFF] font-orbitron">
                      MISSION DESCRIPTION
                    </p>
                    <div className="w-full text-[#CFD8DC]">{task?.description}</div>
                  </div>
                )}

{task?.assets?.length > 0 && (
  <div className="pb-10">
    <p className="text-lg font-semibold text-[#FFFFFF] font-orbitron">
      MISSION ASSETS
    </p>
    <div className="w-full grid grid-cols-1 gap-4">
      {task?.assets?.map((el, index) => (
        <img
          key={index}
          src={el}
          alt={`Asset ${index}`}
          className="w-full rounded cosmic-fullscreen-asset"
        />
      ))}
    </div>
  </div>
)}
                

                {task?.links?.length > 0 && (
                  <div className="">
                    <p className="text-lg font-semibold text-[#FFFFFF] font-orbitron">
                      SUPPORT LINKS
                    </p>
                    <div className="w-full flex flex-col gap-4">
                      {task?.links?.map((el, index) => (
                        <a
                          key={index}
                          href={el}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#40C4FF] hover:underline"
                        >
                          {el}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <Activities activity={task?.activities} refetch={refetch} id={id} />
          </>
        )}
      </Tabs>
    </div>
  );
};

export default TaskDetail;