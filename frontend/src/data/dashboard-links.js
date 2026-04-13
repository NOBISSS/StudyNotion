import { ACCOUNT_TYPE } from "../utils/constants"

export const adminLinks = [
    {
        name: "Analytics",
        path: "/dashboard/admin",
        icon: "RiBarChartBoxLine",
    },
    {
        name: "Category Management",
        path: "/dashboard/admin/categories",
        icon: "MdCategory",
    },
    {
        name: "User Management",
        path: "/dashboard/admin/users",
        icon: "HiOutlineUsers",
    },
    {
        name: "Course Management",
        path: "/dashboard/admin/courses",
        icon: "FiBookOpen",
    },
]



export const sidebarLinks = [
    {
        id: 1,
        name: "My Profile",
        path: "/dashboard/my-profile",
        icon: "VscAccount",
    },
    {
        id: 2,
        name: "Dashboard",
        path: "/dashboard/analytics",
        type: ACCOUNT_TYPE.INSTRUCTOR,
        icon: "VscDashboard",
    },
    {
        id: 3,
        name: "Dashboard",
        path: "/dashboard/analytics",
        type: ACCOUNT_TYPE.STUDENT,
        icon: "VscDashboard",
    },
    {
        id: 4,
        name: "My Courses",
        path: "/dashboard/my-courses",
        type: ACCOUNT_TYPE.INSTRUCTOR,
        icon: "VscVm",
    },
    {
        id: 5,
        name: "Add Course",
        path: "/dashboard/add-course",
        type: ACCOUNT_TYPE.INSTRUCTOR,
        icon: "VscAdd",
    },
    {
        id: 6,
        name: "Enrolled Courses",
        path: "/dashboard/enrolled-courses",
        type: ACCOUNT_TYPE.STUDENT,
        icon: "VscMortarBoard",
    },
    // {
    //     id:7,
    //     name:"Purchase History",
    //     path:"/dashboard/purchase-history",
    //     type:ACCOUNT_TYPE.STUDENT,
    //     icon:"VscHistory",
    // },
    {
        id: 8,
        name: "Wishlists",
        path: "/dashboard/cart",
        type: ACCOUNT_TYPE.STUDENT,
        icon: "VscArchive",
    },
    {
        id: 9,
        name: "Analytics",
        path: "/dashboard/admin/analytic",
        icon: "RiBarChartBoxLine",
        type: ACCOUNT_TYPE.ADMIN,
    },
    {
        id: 10,
        name: "Category Management",
        path: "/dashboard/admin/categories",
        icon: "MdOutlineCategory",
        type: ACCOUNT_TYPE.ADMIN,
    },
    {
        id: 11,
        name: "User Management",
        path: "/dashboard/admin/users",
        icon: "FiUsers",
        type: ACCOUNT_TYPE.ADMIN,
    },
    {
        id: 12,
        name: "Course Management",
        path: "/dashboard/admin/courses",
        icon: "MdOutlineMenuBook",
        type: ACCOUNT_TYPE.ADMIN,
    },
];