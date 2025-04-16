import clsx from "clsx";
import React from "react";
import { FaTasks, FaUsers, FaRocket } from "react-icons/fa"; 
import {
  MdDashboard,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const linkData = [
  {
    label: "Mission Control",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Missions",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Orbit Achieved",
    link: "completed/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Orbit",
    link: "in-progress/in progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Launch Pad",
    link: "todo/todo",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Crew",
    link: "team",
    icon: <FaUsers />,
  },
  {
    label: "Star Chart",
    link: "status",
    icon: <IoCheckmarkDoneOutline />,
  },
  {
    label: "Groups",
    link: "groups",
    icon: <FaUsers />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => {
    return (
      <Link
        onClick={closeSidebar}
        to={el.link}
        className={clsx(
          "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-[#CFD8DC] text-base hover:bg-[#40C4FF]/20 cosmic-sidebar-item",
          path === el.link.split("/")[0] ? "bg-[#40C4FF] text-white" : ""
        )}
      >
        {el.icon}
        <span className="hover:text-[#40C4FF]">{el.label}</span>
      </Link>
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-5 bg-[#252A36]">
      <h1 className="flex gap-1 items-center">
        <p className="bg-[#40C4FF] p-2 rounded-full cosmic-logo">
          <FaRocket className="text-white text-2xl font-black" />
        </p>
        <span className="text-2xl font-bold text-[#FFFFFF] font-orbitron">
          ProjectR
        </span>
      </h1>

      <div className="flex-1 flex flex-col gap-y-5 py-8">
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;