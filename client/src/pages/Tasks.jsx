import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdGridView } from "react-icons/md";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Loading, Table, Tabs, Title } from "../components";
import { AddTask, BoardView, TaskTitle } from "../components/tasks";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import { TASK_TYPE } from "../utils";
import { useSelector } from "react-redux";

const TABS = [
  { title: "Star Map View", icon: <MdGridView /> },
  { title: "Mission Log View", icon: <FaList /> },
];

const Tasks = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || "");

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  const status = params?.status || "";
  const cosmicStatusLabels = {
    todo: "Launch Pad",
    "in progress": "In Orbit",
    completed: "Orbit Achieved",
  };
  const displayStatus = cosmicStatusLabels[status.toLowerCase()] || status;

  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: status,
    search: searchTerm,
  });

  useEffect(() => {
    refetch();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [open]);

  return isLoading ? (
    <div className="py-10 cosmic-container">
      <Loading />
    </div>
  ) : (
    <div className="w-full cosmic-container">
      <div className="flex items-center justify-between mb-8">
        <Title
          title={displayStatus ? `${displayStatus} Missions` : "Missions"}
          className="text-[#FFFFFF] drop-shadow-[0_1px_3px_rgba(64,196,255,0.5)]"
        />

        {!status && user?.isAdmin && (
          <Button
            label="Launch New Mission"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-[#40C4FF] text-[#252A36] rounded-md py-2 2xl:py-2.5 hover:bg-[#26A69A] transition-colors font-orbitron"
            onClick={() => setOpen(true)}
          />
        )}
      </div>

      <div>
        <Tabs tabs={TABS} setSelected={setSelected}>
          {!status && (
            <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
              <TaskTitle label="Launch Pad" className={TASK_TYPE.todo} />
              <TaskTitle label="In Orbit" className={TASK_TYPE["in progress"]} />
              <TaskTitle label="Orbit Achieved" className={TASK_TYPE.completed} />
            </div>
          )}

          {selected === 0 ? (
            <BoardView tasks={data?.tasks} />
          ) : (
            <Table tasks={data?.tasks} />
          )}
        </Tabs>
      </div>
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;