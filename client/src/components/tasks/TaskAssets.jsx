import React from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";
import { getCompletedSubTasks } from "../../utils";

const TaskAssets = ({ activities, assets, subTasks }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1 items-center text-sm text-[#CFD8DC]">
        <BiMessageAltDetail className="text-[#40C4FF]" />
        <span>{activities}</span>
      </div>
      <div className="flex gap-1 items-center text-sm text-[#CFD8DC]">
        <MdAttachFile className="text-[#40C4FF]" />
        <span>{assets}</span>
      </div>
      <div className="flex gap-1 items-center text-sm text-[#CFD8DC]">
        <FaList className="text-[#40C4FF]" />
        <span>
          {getCompletedSubTasks(subTasks)}/{subTasks?.length}
        </span>
      </div>
    </div>
  );
};

export default TaskAssets;