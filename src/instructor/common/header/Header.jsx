import React, { useState, useEffect, useContext } from "react";
import { LogOut, Bell, User, Moon, Sun, ChevronDown } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { SidebarTrigger } from "../../../components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeContext from "./ThemeContext";
import { fetchSessions } from "@/instructor/Redux/Api/Session_api";
import { useDispatch, useSelector } from "react-redux";
import { setSession } from "@/instructor/Redux/Slice/Session_slice";
import { clearAccessControls, clearToken } from "@/instructor/Redux/Slice/LogoutEmployeeSlice";
import { logoutEmployee } from "@/instructor/Redux/Api/LogoutEmployeeApi";
import { toast } from "react-toastify";
import tryCatchWrapper from "@/instructor/utils/TryCatchHandler";

const Header = () => {
  const [logout, setLogout] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectYearId, setselectYearId] = useState();
  const { Employeee } = useSelector(
    (state) => state.EmployeeProfile
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const { Session, loading, error } = useSelector(
    (state) => state.session || {}
  );

  const sessionID = useSelector((state) => state.session?.selectedSession);
  let token = localStorage.getItem("token");
  token = useSelector((state) => state.employee?.token);
  useEffect(() => {
    dispatch(fetchSessions(token));
  }, [dispatch]);

  // ✅ Set default session only once (when API gives data)
  useEffect(() => {
    if (Session && Session.length > 0 && !sessionID) {
      const defaultSession =
        Session.find((s) => s.is_default === true) || Session[0];

      if (defaultSession) {
        dispatch(setSession(defaultSession.id));
      }
    }
  }, [Session, sessionID, dispatch]);



  // ✅ Find selected session from Redux store
  const selectedSession = Session?.find((s) => s.id === sessionID);

  const getActiveTabName = () => {
    const path = location.pathname;
    if (path === "/Dashboard") return "Dashboard";
    if (path === "/exam") return "Exams";
    if (path === "/Profile") return "Profile";
    if (path === "/Schedule") return "Schedule";
    if (path === "/Assignments") return "Assignments";
    if (path === "/batches") return "batches";
    if (path === "/batch/viewdetails") return "viewdetails";
    if (path === "/accounts") return "Accounts";
    if (path === "/Quizzes") return "Quizzes";
    if (path === "/Doubt") return "Doubt";
    return "";
  };

  const shouldShowDropdown =
    // location.pathname.startsWith("/Dashboard")||
    location.pathname.startsWith("/exam") ||
    location.pathname.startsWith("/Schedule") ||
    location.pathname.startsWith("/Assignments") ||
    location.pathname.startsWith("/Quizzes") ||
    location.pathname.startsWith("/batches") ||
    location.pathname.startsWith("/batch/viewdetails") ||
    // location.pathname.startsWith("/accounts");
  useEffect(() => {
    if (logout) {
      const timer = setTimeout(() => setLogout(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [logout]);

  // let token = localStorage.getItem("token");
  // token = useSelector((state) => state.employee?.token);

  const handleLogout = async () => {
    const result = await tryCatchWrapper(() =>
      dispatch(logoutEmployee(token)).unwrap()
    );

    if (result.success) {
      const response = result.data;

      if (response.success) {
        setLogout(false);
        localStorage.removeItem("token");
        localStorage.removeItem("accessControls");
        dispatch(clearToken());
        dispatch(clearAccessControls());
        navigate("/EmployeeeLogin");
        toast.success(response.message || "Logged out successfully");
      }
    }
  };


  const handleSessionSelect = (sessionYear, id) => {
    setSelectedOption(sessionYear);
    setselectYearId(id);
    dispatch(setSession(id));
  };

  // const sessionID = useSelector((state) => state.session?.selectedSession);

  useEffect(() => {
    if (Session && Session.length > 0) {
      let sessionData = null;

      if (sessionID) {
        sessionData = Session.find((s) => s.id === sessionID);
      } else {
        sessionData = Session.find((s) => s.is_default === true);
        if (sessionData) {
          dispatch(setSession(sessionData.id));
        }
      }

      if (sessionData && !selectedOption) {
        setSelectedOption(sessionData.session_year);
        setselectYearId(sessionData.id);
      }
    }
  }, [Session, sessionID, selectedOption, dispatch]);

  useEffect(() => {
    if (selectYearId !== 0) {
      dispatch(setSession(selectYearId));
    }
  }, [dispatch, selectYearId]);

  const sessionList = Array.isArray(Session?.rows)
    ? Session.rows
    : Array.isArray(Session)
      ? Session
      : [];

  return (
    <header className="flex sticky top-0 shrink-0 gap-2 border-b z-[50] h-16 bg-white dark:bg-gray-900 shadow-md items-center px-6">
      <SidebarTrigger className="-ml-1" />
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl ps-9 font-semibold text-blue-700 dark:text-white">
          {getActiveTabName()}
        </h1>

        <div className="flex items-center space-x-6">
          <div className="w-full max-w-lg ms-1 mt-2">
            {shouldShowDropdown && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full font-medium max-w-lg border border-blue-400 dark:border-blue-300 shadow rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-9 py-2 flex justify-between items-center hover:bg-blue-500 hover:text-white">
                    <span>
                      {loading
                        ? "Loading..."
                        : error
                          ? "Failed to load"
                          : selectedSession?.session_year || "Select Year"}
                    </span>
                    <ChevronDown size={18} />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="w-full font-medium max-w-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mt-2 border border-blue-400 dark:border-blue-300 rounded-lg shadow-md"
                >
                  {loading ? (
                    <div className="px-4 py-2 text-center text-gray-500">
                      Loading...
                    </div>
                  ) : error ? (
                    <div className="px-4 py-2 text-center text-red-500">
                      Failed to load
                    </div>
                  ) : (
                    sessionList.map((year) => (
                      <DropdownMenuItem
                        key={year.id}
                        onClick={() =>
                          handleSessionSelect(year.session_year, year.id)
                        }
                        className="cursor-pointer hover:bg-blue-600 hover:text-white px-4 py-2 text-center"
                      >
                        {year.session_year}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="focus:outline-none cursor-pointer"
            >
              {darkMode ? (
                <Sun size={25} className="text-yellow-400" />
              ) : (
                <Moon size={25} className="text-gray-700 dark:text-white" />
              )}
            </button>

            <div className="relative">
              <Bell
                size={25}
                className="text-gray-700 dark:text-white cursor-pointer"
              />
              <span className="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={`https://instructorv2-api-dev.intellix360.in/viewimagefromazure?filePath=${Employeee?.image_path}`}
                />
                <AvatarFallback> {Employeee?.first_name}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2">
              <div className="flex flex-col space-y-2 lg:hidden">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center gap-2 text-gray-900 dark:text-white"
                >
                  {darkMode ? (
                    <Sun size={18} className="text-yellow-400" />
                  ) : (
                    <Moon
                      size={18}
                      className="text-gray-700 dark:text-white"
                    />
                  )}
                  <span>Dark Mode</span>
                </button>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Bell size={18} />
                  <span>Notifications</span>
                </div>
              </div>

              <DropdownMenuItem
                onClick={() => navigate("/Profile")}
                className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-white"
              >
                <User size={18} /> Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setLogout(true)}
                className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400"
              >
                <LogOut size={18} /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={logout} onOpenChange={setLogout}>
            <DialogContent className="sm:max-w-[425px] shadow-lg p-6 rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-center text-[22px] font-semibold">
                  Confirm Logout
                </DialogTitle>
                <DialogDescription className="text-center text-md">
                  Are you sure you want to log out?
                </DialogDescription>
              </DialogHeader>
              <hr className="mt-4" />
              <div className="flex justify-center gap-4 mt-4">
                <Button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  onClick={() => setLogout(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Logout
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
