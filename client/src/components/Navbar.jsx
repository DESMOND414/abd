import React, { useEffect, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import UserAvatar from "./UserAvatar";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { updateURL } from "../utils";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    updateURL({ searchTerm, navigate, location });
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  return (
    <div className="flex justify-between items-center bg-[#252A36] px-4 py-3 2xl:py-4 sticky z-10 top-0 cosmic-card">
      <div className="flex gap-4">
        <div>
          <button
            onClick={() => dispatch(setOpenSidebar(true))}
            className="text-2xl text-[#CFD8DC] hover:text-[#40C4FF] block md:hidden"
          >
            ☰
          </button>
        </div>

        {location?.pathname !== "/dashboard" && (
          <form
            onSubmit={handleSubmit}
            className="w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#1A1F2B] border border-[#546E7A]/50"
          >
            <MdOutlineSearch className="text-[#CFD8DC] text-xl" />
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              type="text"
              placeholder="Search..."
              className="flex-1 outline-none bg-transparent placeholder:text-[#CFD8DC] text-[#FFFFFF]"
            />
          </form>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;