import { Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Navbar, Sidebar } from "./components";
import {
  Dashboard,
  Login,
  TaskDetail,
  Tasks,
  Users,
  StatusPage,
  Groups,
} from "./pages";
import { setOpenSidebar } from "./redux/slices/authSlice";

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row cosmic-container">
      <div className="w-1/5 h-screen bg-[#252A36] sticky top-0 hidden md:block cosmic-card">
        <Sidebar />
      </div>

      <MobileSidebar />

      <div className="flex-1 overflow-y-auto">
        <Navbar />

        <div className="p-4 2xl:px-10 bg-[#1A1F2B]">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/log-in" state={{ from: location }} replace />
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter="transition-opacity duration-700"
        enterFrom="opacity-x-10"
        enterTo="opacity-x-100"
        leave="transition-opacity duration-700"
        leaveFrom="opacity-x-100"
        leaveTo="opacity-x-0"
      >
        {(ref) => (
          <div
            ref={(node) => (mobileMenuRef.current = node)}
            className={`md:hidden w-full h-full bg-[#1A1F2B]/60 transition-transform duration-700 transform
             ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            onClick={() => closeSidebar()}
          >
            <div className="bg-[#252A36] w-3/4 h-full cosmic-card">
              <div className="w-full flex justify-end px-5 pt-5">
                <button
                  onClick={() => closeSidebar()}
                  className="flex justify-end items-end text-[#CFD8DC] hover:text-[#40C4FF]"
                >
                  <IoMdClose size={25} />
                </button>
              </div>

              <div className="-mt-10">
                <Sidebar />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};

const App = () => {
  const theme = "cosmic";

  return (
    <main className={theme}>
      <div className="w-full min-h-screen bg-[#1A1F2B]">
        <Routes>
          <Route element={<Layout />}>
            <Route index path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/completed/:status?" element={<Tasks />} />
            <Route path="/in-progress/:status?" element={<Tasks />} />
            <Route path="/todo/:status?" element={<Tasks />} />
            <Route path="/task/:id" element={<TaskDetail />} />
            <Route path="/team" element={<Users />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/groups" element={<Groups />} />
          </Route>

          <Route path="/log-in" element={<Login />} />
        </Routes>
      </div>
    </main>
  );
};

export default App;