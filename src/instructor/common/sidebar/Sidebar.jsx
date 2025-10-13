import React from "react";
import { useNavigate } from "react-router-dom";
import intellix_icon from "../../../assets/logo/Image.png";
import {
  Grip,
  Home,
  User,
  Users,
  Wallet,
  ChartColumnIncreasing,
  CircleHelp,
  Settings,
  Clipboard,
  ListFilterPlus,
  FileBadge,
  X,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
  SidebarRail,
} from "../../../components/ui/sidebar";
import { NavMain } from "../../../components/ui/Nav-main";
import { Radio } from "lucide-react";
import { CalendarCheck } from "lucide-react";
import { Share2 } from "lucide-react";
import { BookOpenCheck } from "lucide-react";
import { BookOpenText } from "lucide-react";
import { Layers } from "lucide-react";
import { ShieldQuestion } from "lucide-react";
import { Youtube } from "lucide-react";
import { useSelector } from "react-redux";

const AppSidebar = ({ ...props }) => {
  const navigate = useNavigate();
  const { isOpen, toggleSidebar } = useSidebar();

 let accessControls = useSelector((state) => state.employee?.accessControls);
accessControls = JSON.parse(localStorage.getItem("accessControls")) || [];

const data = [
  { title: "Dashboard", url: "/Dashboard", icon: Home, key: "dashboard" },
  { title: "Quizzes", url: "/Quizzes", icon: Share2, key: "quiz" },
  { title: "Exams", url: "/exam", icon: BookOpenCheck, key: "exam" },
  { title: "Assignments", url: "/Assignments", icon: BookOpenText, key: "assignment" },
  { title: "Batches", url: "/batches", icon: Layers, key: "batch" },
  { title: "Accounts", url: "/accounts", icon: Wallet, key: "account" },
  { title: "Doubt", url: "/Doubt", icon: ShieldQuestion, key: "doubt" },
  { title: "Settings", url: "/Profile", icon: Settings, key: "setting" },
];


const filteredData = data.filter(item => accessControls.includes(item.key));



  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="  bg-white dark:bg-gray-900">
        {/* Sidebar Logo & Close Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              className="w-10 h-10 "
              src={intellix_icon}
              alt="Intellix Logo"
            />
            {!isOpen && <h5 className="text-xl font-semibold">Intellix</h5>}
          </div>
          <button
            onClick={() => toggleSidebar(false)}
            className="block sm:hidden p-2 z-50 h-10 w-10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredData} />
      </SidebarContent>
      <SidebarFooter>© 2025 Intellix</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
