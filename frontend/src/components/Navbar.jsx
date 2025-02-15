import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Bell,
  LogOut,
  User,
  Users,
  Feather,
  Menu,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";

const Navbar = ({ toggleSearchBar }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => axiosInstance.get("/notifications"),
    enabled: !!authUser,
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => axiosInstance.get("/connections/requests"),
    enabled: !!authUser,
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      toast.success("Logged out successfully !");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const unreadNotificationCount = notifications?.data.filter(
    (notif) => !notif.read
  ).length;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <nav className="bg-base-100 shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-1">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <div className="flex justify-center items-center gap-2">
                <Feather className="mx-auto text-primary" size={35} />
                <div className="text-xl font-bold font-sans">Connekt</div>
              </div>
            </Link>
          </div>
          <div className="flex items-center justify-center md:gap-6">
            <label className="swap swap-rotate cursor-pointer">
              {/* Light Mode (Sun Icon) */}
              <input type="checkbox" onChange={toggleTheme} />

              <svg
                className="swap-on fill-current w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>

              {/* Dark Mode (Moon Icon) */}
              <svg
                className="swap-off fill-current w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </label>
            {authUser && (
              <button
                className="flex flex-col items-center disabled:cursor-not-allowed"
                onClick={() => toggleSearchBar((prev) => !prev)}
                disabled={!isActive("/")}
              >
                <Search className="mx-3 w-6 h-6 md:mx-0 md:w-5 md:h-5" />
                <span className="text-xs hidden md:block">Search</span>
              </button>
            )}
            {/* Mobile Menu */}
            <div className="drawer drawer-end block md:hidden">
              <input
                id="my-drawer-4"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className="drawer-content">
                <label htmlFor="my-drawer-4" className="drawer-button">
                  <Menu size={35} className="block md:hidden" />
                </label>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="my-drawer-4"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4">
                  <Link to="/">
                    <div className="flex justify-center items-center gap-2 mb-5">
                      <Feather className="text-primary" size={35} />
                      <div className="text-xl font-bold font-sans">Connekt</div>
                    </div>
                  </Link>
                  {authUser ? (
                    <div className="flex flex-col gap-2">
                      <li>
                        <Link to={"/"} className="flex items-center">
                          <Home size={20} />
                          <span className="text-sm font-semibold">Home</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/network"
                          className="flex items-center relative"
                        >
                          <Users
                            size={20}
                            className={`${isActive("/network") ? "fill-current" : "fill-none"}`}
                          />
                          <span className="text-sm font-semibold">Network</span>
                          {unreadConnectionRequestsCount > 0 && (
                            <span
                              className="absolute top-[0.6rem] right-4 md:right-1.5 bg-primary text-white text-xs 
											rounded-full size-4 flex items-center justify-center"
                            >
                              {unreadConnectionRequestsCount}
                            </span>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/notifications"
                          className="flex items-center relative"
                        >
                          <Bell
                            size={20}
                            className={`${isActive("/notifications") ? "fill-current" : "fill-none"}`}
                          />
                          <span className="text-sm font-semibold">
                            Notifications
                          </span>
                          {unreadNotificationCount > 0 && (
                            <span
                              className="absolute top-[0.6rem] right-4 md:right-4 bg-primary text-white text-xs 
											rounded-full size-4 flex items-center justify-center"
                            >
                              {unreadNotificationCount}
                            </span>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={`/profile/${authUser.username}`}
                          className="flex items-center"
                        >
                          <User
                            size={20}
                            className={`${isActive(`/profile/${authUser.username}`) ? "fill-current" : "fill-none"}`}
                          />
                          <span className="text-sm font-semibold">Profile</span>
                        </Link>
                      </li>
                      <button
                        className="mt-2 self-center flex justify-center items-center space-x-1 text-sm bg-red-600 text-white py-2 px-24 rounded-lg font-semibold"
                        onClick={() => {
                          if (
                            !window.confirm("Are you sure you want to logout ?")
                          )
                            return;
                          logout();
                        }}
                      >
                        <LogOut size={20} />
                        <span className="">Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/login"
                        className="self-center flex justify-center items-center bg-accent text-white px-[6.45rem] text-sm sm:text-base sm:px-5 py-2 rounded-md font-medium"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/sign-up"
                        className=" self-center flex justify-center items-center bg-primary text-white px-24 text-sm sm:text-base sm:px-4 py-2 rounded-md font-medium"
                      >
                        Join now
                      </Link>
                    </div>
                  )}
                  <div className="self-center mt-4 text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} Connekt. All Rights
                    Reserved.
                  </div>
                </ul>
              </div>
            </div>
            {/* Desktop Menu*/}
            {authUser ? (
              <>
                <Link to={"/"} className="flex flex-col items-center">
                  <Home size={20} className="hidden md:block" />
                  <span className="text-xs hidden md:block">Home</span>
                </Link>
                <Link
                  to="/network"
                  className="flex flex-col items-center relative"
                >
                  <Users
                    size={20}
                    className={`hidden md:block ${isActive("/network") ? "fill-current" : "fill-none"}`}
                  />
                  <span className="text-xs hidden md:block">Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 md:right-1.5 bg-primary text-white text-xs 
										rounded-full size-3 md:size-4 hidden md:flex items-center justify-center"
                    >
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/notifications"
                  className="flex flex-col items-center relative"
                >
                  <Bell
                    size={20}
                    className={`hidden md:block ${isActive("/notifications") ? "fill-current" : "fill-none"}`}
                  />
                  <span className="text-xs hidden md:block">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 md:right-4 bg-primary text-white text-xs 
										rounded-full size-3 md:size-4 hidden md:flex items-center justify-center"
                    >
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>
                <Link
                  to={`/profile/${authUser.username}`}
                  className="flex flex-col items-center"
                >
                  <User
                    size={20}
                    className={`hidden md:block ${isActive(`/profile/${authUser.username}`) ? "fill-current" : "fill-none"}`}
                  />
                  <span className="text-xs hidden md:block">Profile</span>
                </Link>
                <button
                  className="hidden md:flex items-center space-x-1 text-sm bg-red-600 text-white py-2 px-4 rounded-lg font-semibold"
                  onClick={() => {
                    if (!window.confirm("Are you sure you want to logout ?"))
                      return;
                    logout();
                  }}
                >
                  <LogOut size={20} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block bg-accent text-white px-3 text-xs sm:text-base sm:px-5 py-1.5 rounded-md font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/sign-up"
                  className="hidden md:block bg-primary text-white px-3 text-xs sm:text-base sm:px-4 py-1.5 rounded-md font-medium"
                >
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
