import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/slices/api/authApiSlice";
import { logout } from "../redux/slices/authSlice";
import { getInitials } from "../utils";
import AddUser from "./AddUser";
import ChangePassword from "./ChangePassword";

const UserAvatar = () => {
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [logoutUser] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      console.log("Logged out successfully");
      navigate("/log-in");
    } catch (error) {
      console.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-[#40C4FF] cosmic-button-glow">
              <span className="text-[#252A36] font-semibold font-orbitron">
                {getInitials(user?.name)}
              </span>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-[#546E7A] rounded-md bg-[#252A36] shadow-lg ring-1 ring-[#40C4FF]/20 focus:outline-none">
              <div className="p-4">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpen(true)}
                      className={`${
                        active ? "bg-[#40C4FF]/20 text-[#FFFFFF]" : "text-[#CFD8DC]"
                      } group flex w-full items-center rounded-md px-2 py-2 text-base font-orbitron cosmic-dropdown-menu`}
                    >
                      <FaUser className="mr-2 text-[#40C4FF]" aria-hidden="true" />
                      Profile
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpenPassword(true)}
                      className={`${
                        active ? "bg-[#40C4FF]/20 text-[#FFFFFF]" : "text-[#CFD8DC]"
                      } group flex w-full items-center rounded-md px-2 py-2 text-base font-orbitron cosmic-dropdown-menu`}
                    >
                      <FaUserLock className="mr-2 text-[#40C4FF]" aria-hidden="true" />
                      Change Password
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logoutHandler}
                      className={`${
                        active ? "bg-[#EF5350]/20 text-[#EF5350]" : "text-[#EF5350]"
                      } group flex w-full items-center rounded-md px-2 py-2 text-base font-orbitron cosmic-dropdown-menu`}
                    >
                      <IoLogOutOutline className="mr-2 text-[#EF5350]" aria-hidden="true" />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <AddUser open={open} setOpen={setOpen} userData={user} />
      <ChangePassword open={openPassword} setOpen={setOpenPassword} />
    </>
  );
};

export default UserAvatar;