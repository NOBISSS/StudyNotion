// components/core/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { TiArrowSortedDown } from "react-icons/ti";
import { IoSearchOutline, IoClose, IoMenuOutline } from "react-icons/io5";
import { NavBarLinks } from "../../data/navbar-links";
import ProfileDropDown from "./Auth/ProfileDropDown";
import { fetchAllCategories } from "../../services/operations/CatalogAPI";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const categories     = useSelector(state => state.catalog.categories);
  const { token }      = useSelector(state => state.auth);
  const { user }       = useSelector(state => state.profile);
  const { totalItems } = useSelector(state => state.cart);

  const [openProfile, setOpenProfile]     = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);

  const profileRef = useRef(null);
  const navbarRef  = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setOpenProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch categories once
  useEffect(() => {
    if (!categories?.length) dispatch(fetchAllCategories());
  }, [categories, dispatch]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileCatOpen(false);
  }, [location.pathname]);

  const matchRoute = (route) => matchPath({ path: route }, location.pathname);

  const profilePic  = user?.additionalDetails?.profilePicture || user?.image || null;
  const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";

  return (
    <>
      <div ref={navbarRef} className="sticky top-0 z-50 border-b border-[#2C333F] bg-[#161D29]">
        <div className="mx-auto flex h-14 w-full items-center justify-between px-[8.5vw]">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} loading="lazy" alt="StudyNotion Logo" className="h-8 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:block">
            
              <ul className="flex flex-row items-center gap-x-8">
                {NavBarLinks.filter((link) => link.for.includes(user?.accountType ? user.accountType : "student")).map((link, index) => (
                  <li key={index} className="relative">
                    {link.title === "Catalog" ? (

                    // ── Catalog trigger — dropdown anchored to full navbar width ──
                    <div className="group relative flex cursor-pointer items-center gap-1 py-4">
                      <span className={`text-sm font-medium transition-colors group-hover:text-[#FFD60A] ${
                        matchRoute("/catalog/:catalogName/:catalogId") ? "text-[#FFD60A]" : "text-[#DBDDEA]"
                      }`}>
                        {link.title}
                      </span>
                      <TiArrowSortedDown className={`text-xs transition-all duration-200 group-hover:rotate-180 group-hover:text-[#FFD60A] ${
                        matchRoute("/catalog/:catalogName/:catalogId") ? "text-[#FFD60A]" : "text-[#DBDDEA]"
                      }`} />

                      {/* 
                        KEY FIX: Instead of centering on the "Catalog" text (which overflows),
                        we anchor the panel to the LEFT edge of the viewport using fixed positioning.
                        The panel spans the full navbar width with left/right based on px-[8.5vw].
                      */}
                      <div className="pointer-events-none invisible absolute top-full left-1/2 -translate-x-1/2 opacity-0 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 z-50">

                        {/* Caret */}
                        <div className="flex justify-center">
                          <div className="h-0 w-0"
                            style={{ borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "8px solid #2C333F" }}
                          />
                        </div>
                        <div className="flex justify-center -mt-[7px]">
                          <div className="h-0 w-0"
                            style={{ borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderBottom: "7px solid #1F2937" }}
                          />
                        </div>

                        {/* Panel — wide enough to fit all categories in a grid, capped & scrollable */}
                        <div className="rounded-xl border border-[#2C333F] bg-[#1F2937] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                          style={{ width: "min(700px, 88vw)" }}
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between border-b border-[#2C333F] px-5 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6B7280]">
                              Browse Categories
                            </p>
                            <span className="rounded-full bg-[#2C333F] px-2 py-0.5 text-[10px] font-medium text-[#AFB2BF]">
                              {categories?.length || 0}
                            </span>
                          </div>

                          {/* Scrollable category grid — max 320px tall, then scrolls */}
                          {categories?.length > 0 ? (
                            <div
                              className="overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-[#2C333F] scrollbar-track-transparent"
                              style={{ maxHeight: "320px" }}
                            >
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-0.5">
                                {categories.map((cat, i) => (
                                  <Link
                                    to={`/catalog/${cat?.name}/${cat?._id}`}
                                    key={cat._id || i}
                                  >
                                    <div className="group/row flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-all duration-150 hover:bg-[#2C333F]">
                                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#374151] transition-colors duration-150 group-hover/row:bg-[#FFD60A]" />
                                      {/* truncate prevents individual item overflow */}
                                      <span className="truncate text-sm text-[#9CA3AF] transition-colors duration-150 group-hover/row:text-[#F9FAFB]">
                                        {cat.name}
                                      </span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-10 text-sm text-[#6B7280]">
                              No categories found
                            </div>
                          )}

                          {/* Footer */}
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

          {/* Right side */}
          <div className="flex items-center gap-x-1">

            {/* Search */}
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-[#AFB2BF] transition-colors hover:bg-[#2C333F] hover:text-white">
              <IoSearchOutline className="text-[18px]" />
            </button>

            {/* Cart */}
            {user && user?.accountType !== "instructor" && (
              <Link
                to="/dashboard/cart"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#AFB2BF] transition-colors hover:bg-[#2C333F] hover:text-white"
              >
                <AiOutlineShoppingCart className="text-xl" />
                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#FFD60A] text-[9px] font-bold leading-none text-black">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Divider */}
            {token === null && <div className="mx-2 h-5 w-px bg-[#2C333F]" />}

            {/* Auth buttons */}
            {token === null && (
              <div className="hidden items-center gap-x-2 md:flex">
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

            {/* Profile */}
            {token !== null && (
              <div className="relative ml-1" ref={profileRef}>
                <button
                  onClick={() => setOpenProfile(prev => !prev)}
                  className="relative ml-1 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#2C333F] transition-all hover:ring-[#FFD60A]"
                >
                  {profilePic ? (
                    <img src={profilePic} alt={`profile-${user?.firstName}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#FFD60A] text-sm font-bold text-black">
                      {userInitial}
                    </div>
                  )}
                </button>
                {openProfile && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-50">
                    <ProfileDropDown />
                  </div>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-[#AFB2BF] transition-colors hover:bg-[#2C333F] hover:text-white md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <IoClose className="text-xl" /> : <IoMenuOutline className="text-xl" />}
            </button>
          </div>
        </div>

        {/* ══ MOBILE MENU DRAWER ══════════════════════════════════════════ */}
        {mobileOpen && (
          <div className="border-t border-[#2C333F] bg-[#161D29] pb-4 md:hidden">
            <div className="flex flex-col gap-1 px-6 pt-3">

              {NavBarLinks.map((link, i) => (
                <div key={i}>
                  {link.title === "Catalog" ? (
                    <div>
                      {/* Collapsible catalog section on mobile */}
                      <button
                        onClick={() => setMobileCatOpen(o => !o)}
                        className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-[#DBDDEA]"
                      >
                        <span>Catalog</span>
                        <TiArrowSortedDown className={`text-xs transition-transform duration-200 ${mobileCatOpen ? "rotate-180 text-[#FFD60A]" : ""}`} />
                      </button>

                      {mobileCatOpen && (
                        <div
                          className="ml-3 mt-1 overflow-y-auto rounded-lg border border-[#2C333F] bg-[#1C2333]"
                          style={{ maxHeight: "240px" }}
                        >
                          {/* 2-column grid inside mobile drawer */}
                          <div className="grid grid-cols-2 gap-0.5 p-2">
                            {categories?.map((cat) => (
                              <Link
                                key={cat._id}
                                to={`/catalog/${cat?.name}/${cat?._id}`}
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#9CA3AF] transition-colors hover:bg-[#2C333F] hover:text-[#FFD60A]"
                              >
                                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#374151]" />
                                <span className="truncate">{cat.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link?.path}
                      className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[#1C2333] hover:text-[#FFD60A] ${
                        matchRoute(link?.path) ? "text-[#FFD60A]" : "text-[#DBDDEA]"
                      }`}
                    >
                      {link?.title}
                    </Link>
                  )}
                </div>
              ))}

              <div className="my-2 h-px bg-[#2C333F]" />

              {token === null && (
                <div className="flex flex-col gap-2">
                  <Link to="/login">
                    <button className="w-full rounded-md border border-[#2C333F] bg-transparent py-2.5 text-sm font-medium text-[#AFB2BF] transition-all hover:border-[#FFD60A] hover:text-white">
                      Log in
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="w-full rounded-md bg-[#FFD60A] py-2.5 text-sm font-semibold text-black transition-all hover:bg-yellow-300">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}

              {token !== null && (
                <div className="flex items-center gap-3 rounded-lg bg-[#1C2333] px-3 py-3">
                  {profilePic ? (
                    <img src={profilePic} alt={user?.firstName} className="h-9 w-9 rounded-full object-cover ring-2 ring-[#2C333F]" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD60A] text-sm font-bold text-black">
                      {userInitial}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#F1F2FF]">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="truncate text-xs text-[#6B7280]">{user?.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;