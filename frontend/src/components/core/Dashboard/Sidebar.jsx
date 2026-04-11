import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sidebarLinks } from "../../../data/dashboard-links";
import SideBarLink from "./SideBarLink";

const Sidebar = () => {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile,
  );
  const { loading: authLoading } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  if (profileLoading || authLoading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] w-[56px] items-start justify-center bg-[#161D29] pt-6">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2C3244] border-t-[#FFD60A]" />
      </div>
    );
  }

  return (
    <div
      className="relative flex-shrink-0 transition-all duration-300"
      style={{ width: collapsed ? 56 : 220 }}
    >
      <div
        className="flex h-[calc(100vh-3.5rem)] flex-col border-r border-r-[#1C2333] bg-[#161D29]"
        style={{ width: collapsed ? 56 : 220 }}
      >
        <div
          className={`flex items-center border-b border-[#1C2333] py-3 ${collapsed ? "justify-center px-0" : "justify-end px-3"}`}
        >
          <button
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#6B7280] transition-all hover:bg-[#2C333F] hover:text-white"
          >
            {collapsed ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            )}
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto py-4">
          <div className="flex flex-col">
            {sidebarLinks.map((link, index) => {
              if (link.type && user?.accountType !== link.type) return null;
              return (
                <SideBarLink
                  key={link.id || index}
                  link={link}
                  iconName={link.icon}
                  collapsed={collapsed}
                />
              );
            })}
          </div>
          <div
            className="mx-auto my-5 h-px bg-[#1C2333]"
            style={{ width: collapsed ? 32 : "83%" }}
          />
          <div className="flex flex-col">
            <SideBarLink
              link={{ name: "Settings", path: "/dashboard/settings" }}
              iconName="VscSettingsGear"
              collapsed={collapsed}
            />
          </div>
        </div>
        {!collapsed && user && (
          <div
            className="flex items-center gap-3 border-t border-[#1C2333] px-4 py-4 cursor-pointer"
            onClick={() => navigate("/dashboard/my-profile")}
          >
            <div className="relative h-8 w-8 flex-shrink-0">
              {user?.additionalDetails?.profilePicture ? (
                <img
                  src={user.additionalDetails?.profilePicture}
                  alt={user.firstName}
                  className="h-full w-full rounded-full object-cover ring-2 ring-[#2C333F]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#FFD60A] text-sm font-bold text-black ring-2 ring-[#2C333F]">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Online dot */}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#161D29] bg-green-400" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[#F1F2FF]">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-[11px] text-[#6B7280]">
                {user.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
