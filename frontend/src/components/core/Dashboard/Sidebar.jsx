import { useState, useEffect } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  // Detect screen size (mobile default closed)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(false);
        setMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (profileLoading || authLoading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] w-[56px] items-start justify-center bg-[#161D29] pt-6">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2C3244] border-t-[#FFD60A]" />
      </div>
    );
  }

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#161D29] text-white"
      >
        ☰
      </button>

      {/* BACKDROP */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed lg:static top-0 left-0 z-50
          h-[calc(100vh-3.5rem)] lg:h-auto
          bg-[#161D29] border-r border-[#1C2333]
          transition-all duration-300

          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ width: collapsed ? 56 : 220 }}
      >
        {/* HEADER (collapse button) */}
        <div
          className={`flex items-center border-b border-[#1C2333] py-3 ${
            collapsed ? "justify-center" : "justify-end px-3"
          }`}
        >
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-md text-[#6B7280] hover:bg-[#2C333F] hover:text-white"
          >
            {collapsed ? ">" : "<"}
          </button>

          {/* MOBILE CLOSE */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white px-4"
          >
            ✕
          </button>
        </div>

        {/* LINKS */}
        <div className="flex flex-col overflow-y-auto py-4">
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

          {/* Divider */}
          <div
            className="mx-auto my-5 h-px bg-[#1C2333]"
            style={{ width: collapsed ? 32 : "83%" }}
          />

          {/* Settings */}
          <SideBarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
            collapsed={collapsed}
          />
        </div>

        {/* PROFILE */}
        {!collapsed && user && (
          <div
            className="flex items-center gap-3 border-t border-[#1C2333] px-4 py-4 cursor-pointer"
            onClick={() => navigate("/dashboard/my-profile")}
          >
            <div className="relative h-8 w-8">
              {user?.additionalDetails?.profilePicture ? (
                <img
                  src={user.additionalDetails.profilePicture}
                  alt={user.firstName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#FFD60A] text-black font-bold">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#161D29] bg-green-400" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs text-[#6B7280]">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
