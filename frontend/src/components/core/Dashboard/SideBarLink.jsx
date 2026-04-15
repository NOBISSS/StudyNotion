// components/core/Dashboard/SideBarLink.jsx
import { NavLink } from "react-router-dom"
import * as VscIcons from "react-icons/vsc"
import * as MdIcons  from "react-icons/md"
import * as Io5Icons from "react-icons/io5"

// ── Safe icon resolver ──────────────────────────────────────────────────────
// Checks react-icons/vsc, md, and io5 in order.
// Falls back to a neutral square if still not found.
function resolveIcon(iconName) {
  if (!iconName) return VscIcons.VscCircle

  // Try each icon pack in priority order
  const icon =
    VscIcons[iconName] ||
    MdIcons[iconName]  ||
    Io5Icons[iconName] ||
    null

  if (!icon) {
    console.warn(`[SideBarLink] Icon "${iconName}" not found in vsc/md/io5 packs. Using fallback.`)
  }

  return icon || VscIcons.VscCircle   // VscCircle as neutral fallback
}

const SideBarLink = ({ link, iconName, collapsed }) => {
  const Icon = resolveIcon(iconName)

  return (
    <NavLink
      to={link.path}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2 mx-2 rounded-md transition-all
        ${isActive
          ? "bg-[#2C333F] text-yellow-400"
          : "text-[#6B7280] hover:bg-[#2C333F] hover:text-white"
        }
        ${collapsed ? "justify-center" : "justify-start"}`
      }
    >
      {/* Icon — always defined because resolveIcon always returns a component */}
      <span className="flex-shrink-0 text-lg">
        <Icon />
      </span>

      {/* Label — hidden when sidebar is collapsed */}
      {!collapsed && (
        <span className="text-sm font-medium whitespace-nowrap truncate">
          {link.name}
        </span>
      )}
    </NavLink>
  )
}

export default SideBarLink