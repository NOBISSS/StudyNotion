// components/core/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import { Link, matchPath, useNavigate } from "react-router-dom";
import { NavBarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "./Auth/ProfileDropDown";
import { TiArrowSortedDown } from "react-icons/ti";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constants";

const Navbar = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const location  = useLocation();

  const [openProfile, setOpenProfile] = useState(false);
  const { token }      = useSelector(state => state.auth);
  const { user }       = useSelector(state => state.profile);
  const { totalItems } = useSelector(state => state.cart);

  const [subLinks, setSubLinks] = useState([]);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSubLinks = async () => {
    try {
      const result = await axios.get(BACKEND_URL + "/categories/getall");
      setSubLinks(result.data?.data?.category || []);
    } catch {
      console.log("COULD NOT FETCH THE CATEGORY LIST");
    }
  };

  useEffect(() => { fetchSubLinks(); }, []);

  const matchRoute = (route) => matchPath({ path: route }, location.pathname);

  const getColumnCount = (count) => {
    if (count <= 5)  return 1;
    if (count <= 10) return 2;
    if (count <= 15) return 3;
    return 4;
  };
  const colCount = getColumnCount(subLinks.length);

  // ── Resolve profile picture ───────────────────────────────────────────────
  // API returns additionalDetails.profilePicture — handle both shapes
  const profilePic =
    user?.additionalDetails?.profilePicture ||
    user?.image ||
    null;

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";

  return (
    <div className="sticky top-0 z-50 flex h-14 items-center justify-center border-b border-[#2C333F] bg-[#161D29] px-[8.5vw]">
      <div className="flex w-full items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/">
          <img src={logo} loading="lazy" alt="StudyNotion Logo" className="h-8 w-auto object-contain" />
        </Link>

        {/* ── Nav Links ── */}
        <nav>
          <ul className="flex flex-row items-center gap-x-8">
            {NavBarLinks.map((link, index) => (
              <li key={index} className="relative">
                {link.title === "Catalog" ? (

                  <div className="group relative flex cursor-pointer items-center gap-1 py-4">
                    <span className={`text-sm font-medium transition-colors group-hover:text-[#FFD60A] ${
                      matchRoute("/catalog/:catalogName/:catalogId") ? "text-[#FFD60A]" : "text-[#DBDDEA]"
                    }`}>
                      {link.title}
                    </span>
                    <TiArrowSortedDown className={`text-xs transition-all duration-200 group-hover:rotate-180 group-hover:text-[#FFD60A] ${
                      matchRoute("/catalog/:catalogName/:catalogId") ? "text-[#FFD60A]" : "text-[#DBDDEA]"
                    }`} />

                    {/* Mega Menu */}
                    <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-3 opacity-0 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="relative mx-auto h-0 w-0"
                        style={{ borderLeft:"8px solid transparent", borderRight:"8px solid transparent", borderBottom:"8px solid #2C333F", left:"calc(50% - 8px)" }} />
                      <div className="relative mx-auto -mt-[7px] h-0 w-0"
                        style={{ borderLeft:"7px solid transparent", borderRight:"7px solid transparent", borderBottom:"7px solid #1F2937", left:"calc(50% - 7px)" }} />

                      <div
                        className="rounded-xl border border-[#2C333F] bg-[#1F2937] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                        style={{ width: colCount === 1 ? 220 : colCount === 2 ? 380 : colCount === 3 ? 520 : 640 }}
                      >
                        <div className="flex items-center justify-between border-b border-[#2C333F] px-5 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6B7280]">
                            Browse Categories
                          </p>
                          <span className="rounded-full bg-[#2C333F] px-2 py-0.5 text-[10px] font-medium text-[#AFB2BF]">
                            {subLinks.length}
                          </span>
                        </div>

                        {subLinks.length > 0 ? (
                          <div className="p-3" style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${colCount}, 1fr)`,
                            gap: "2px",
                          }}>
                            {subLinks.map((subLink, i) => (
                              <Link to={`/catalog/${subLink?.name}/${subLink?._id}`} key={subLink._id || i}>
                                <div className="group/row flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-all duration-150 hover:bg-[#2C333F]">
                                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#374151] transition-colors duration-150 group-hover/row:bg-[#FFD60A]" />
                                  <span className="truncate text-sm text-[#9CA3AF] transition-colors duration-150 group-hover/row:text-[#F9FAFB]">
                                    {subLink.name}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-10 text-sm text-[#6B7280]">
                            No categories found
                          </div>
                        )}

                        <div className="border-t border-[#2C333F] px-5 py-3">
                          <Link to="/catalog">
                            <p className="text-xs font-semibold text-[#FFD60A] transition-opacity hover:opacity-80">
                              View all categories →
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                ) : (
                  <Link to={link?.path}>
                    <p className={`text-sm font-medium transition-colors hover:text-[#FFD60A] ${
                      matchRoute(link?.path) ? "text-[#FFD60A]" : "text-[#DBDDEA]"
                    }`}>
                      {link?.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Right Side ── */}
        <div className="flex items-center gap-x-1">

          {/* Search */}
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-[#AFB2BF] transition-colors hover:bg-[#2C333F] hover:text-white">
            <IoSearchOutline className="text-[18px]" />
          </button>

          {/* Cart */}
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#AFB2BF] transition-colors hover:bg-[#2C333F] hover:text-white">
              <AiOutlineShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#FFD60A] text-[9px] font-bold leading-none text-black">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token === null && <div className="mx-2 h-5 w-px bg-[#2C333F]" />}

          {/* Auth Buttons */}
          {token === null && (
            <div className="flex items-center gap-x-2">
              <Link to="/login">
                <button className="rounded-md border border-[#2C333F] bg-transparent px-[14px] py-[6px] text-sm font-medium text-[#AFB2BF] transition-all hover:border-[#FFD60A] hover:text-white">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-md bg-[#FFD60A] px-[14px] py-[6px] text-sm font-semibold text-black transition-all hover:bg-yellow-300">
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {/* Profile Avatar + Dropdown */}
          {token !== null && (
            <div className="relative ml-1" ref={profileRef}>
              <button
                onClick={() => setOpenProfile(prev => !prev)}
                className="relative ml-1 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#2C333F] transition-all hover:ring-[#FFD60A]"
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt={`profile-${user?.firstName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  /* Fallback: coloured initial */
                  <div className="flex h-full w-full items-center justify-center bg-[#FFD60A] text-sm font-bold text-black">
                    {userInitial}
                  </div>
                )}
              </button>

              {/* Dropdown — right-aligned, appears below with gap */}
              {openProfile && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[180px]">
                  <ProfileDropDown />
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Navbar;