"use client"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar"
import { useLocation } from "react-router-dom"

export function NavMain({ items }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = currentPath === item.url;

          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                className={`pt-6 pb-6 ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-500 hover:text-white"
                }`}
                asChild
                tooltip={item.tooltip || item.title}
              >
                <a href={item.url} className="flex items-center gap-3">
                  {item.icon && (
                    <item.icon className={`size-5 ${isActive ? "" : ""}`} />
                  )}
                  <span className="font-semibold text-[17px]">
                    {item.title}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
