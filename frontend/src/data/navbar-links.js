export const NavBarLinks = [
  {
    title: "Home",
    path: "/",
    for: ["student", "admin", "instructor"],
  },
  {
    title: "Catalog",
    path: "/catalog/:catalogName/:catalogId",
    for: ["student", "admin"],
  },
  {
    title: "About Us",
    path: "/about",
    for: ["student", "admin", "instructor"],
  },
  {
    title: "Contact us",
    path: "/contact",
    for: ["student", "admin", "instructor"],
  },
];