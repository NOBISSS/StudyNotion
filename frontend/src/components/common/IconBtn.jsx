// components/common/IconBtn.jsx
import { Link } from "react-router-dom"
import * as VscIcons from "react-icons/vsc"
import * as MdIcons  from "react-icons/md"
import * as Io5Icons from "react-icons/io5"

function resolveIcon(iconName) {
  if (!iconName) return null
  return (
    VscIcons[iconName] ||
    MdIcons[iconName]  ||
    Io5Icons[iconName] ||
    null
  )
}

export const IconBtn = ({
  children,
  active,
  linkto,
  iconName,
  text,
  onClick,
  type = "button",
  customClassName,
}) => {
  const Icon = resolveIcon(iconName)

  const commonClasses = `
    flex items-center justify-center gap-2 px-6 py-2
    rounded-md font-bold transition-all duration-200
    ${active ? "bg-[#FFD60A] text-black" : "text-white bg-[#161D29]"}
    ${customClassName || ""}
  `

  const content = (
    <>
      {text && <span className="text-sm">{text}</span>}
      {children}
      {/* Only render icon if it resolved — never render undefined */}
      {Icon && <Icon className="text-lg" />}
    </>
  )

  if (linkto) {
    return <Link to={linkto} className={commonClasses}>{content}</Link>
  }

  return (
    <button type={type} onClick={onClick} className={commonClasses}>
      {content}
    </button>
  )
}