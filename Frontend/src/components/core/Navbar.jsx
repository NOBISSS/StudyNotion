    import React, { useEffect, useRef, useState } from 'react'
    import logo from "../../assets/logo.png"
    import { Link, matchPath, useNavigate } from 'react-router-dom'
    import { NavBarLinks } from '../../data/navbar-links'
    import { useLocation } from 'react-router-dom'
    import { useDispatch, useSelector } from 'react-redux'
    import { CTAButton } from './HomePage/Button'
    import { AiOutlineShoppingCart } from "react-icons/ai";
    import ProfileDropDown from './Auth/ProfileDropDown'
    import { apiConnector } from '../../services/apiconnector'
    import { categories } from '../../services/apis'
    import { TiArrowSortedDown } from "react-icons/ti";
    import toast from 'react-hot-toast'
    import axios from 'axios'
    import { logout } from '../../services/operations/authAPI'
    import SideBarLink from './Dashboard/SideBarLink'


    // const subLinks=[
    //     {
    //         title:"python",
    //         link:"/catalog/python"
    //     },
    //     {
    //         title:"WebDev",
    //         link:"/catalog/webdev"
    //     },
    // ]
    const Navbar = () => {
            
        const navigate=useNavigate();
        const dispatch=useDispatch();
        
        const [openr,setOpenr]=useState(false);
        const {token}=useSelector((state)=>state.auth);
        const {user}=useSelector((state)=>state.profile)
        const {totalItems}=useSelector((state)=>state.cart);
        const location=useLocation();
        const [subLinks,setSubinks]=useState([
            {
            title:"python",
            link:"/catalog/python"
        },
        {
            title:"WebDev",
            link:"/catalog/webdev"
        },
        ]);
        
        const dropdownRef=useRef(null);
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setOpenr(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

        const fetchSubLinks=async()=>{
                try{
                    //const result=await apiConnector("GET",categories.CATEGORIES_API);
                    const result=await axios.get("http://localhost:3000/api/v1/course/showAllCategories");
                    setSubinks(result.data.Category);
                }catch(error) {
                    console.log("COULD NOT FETCH THE CATEGORY LIST")
                }
        }
        useEffect(()=>{
            fetchSubLinks();
        },[])

        const matchRoute=(route)=>{
            return matchPath({path:route},location.pathname);
        }
    return (
        <div className='flex bg-[#161D29] h-14 items-center px-10 justify-center border-b-[1px] border-b-[#2C333F]'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between '
        >

            <Link to="/">
            <img src={logo}  loading='lazy' alt="StudyNotion Logo" 
            className='w-[9vw]'
            />
            </Link>
            {/**NAV LINKS */}
            <nav>
                <ul className='flex flex-row gap-x-6 text-[#DBDDEA]'>
                    {
                        
                        NavBarLinks.map((link,index)=>(
                            <li key={index}>
                                {
                                    link.title==="Catalog" ? (
                                        <div className='relative flex items-center gap-1 justify-center group'>
                                            <p>{link.title}</p>
                                        <TiArrowSortedDown />

                                        <div className='absolute top-full left-1/2 z-50 mt-2 w-[250px] -translate-x-1/2
                                                            rounded-md bg-white text-black shadow-lg opacity-0 invisible
                                                            font-sans
                                                            
                                                            transition-all duration-200 
                                                            group-hover:opacity-100 group-hover:visible
                                                            px-5
                                                            py-6
                                        '>
                                            <div className='absolute left-[55%] top-0 h-6 w-6 rotate-45 rounded bg-white translate-y-[-10px]'>
                                            </div>
                                            {
                                                
                                                subLinks.length ? (
                                                subLinks?.map((subLink,index)=>(
                                                    <Link to={`/catalog/${subLink?.name}/${subLink?._id}`} key={subLink._id || index}
                                                    className='text-black w-[60px] h-[100px] bg-amber-600 font-sans
                                                    text-[20px]
                                                    border-b-[1px] border-amber-400
                                                    '
                                                    >
                                                    <div className='h-[50px] mb-4
                                                    hover:bg-gray-300 rounded-md flex items-center font-semibold
                                                    '>
                                                        <p
                                                        className='ml-2'
                                                        >{subLink.name}</p>
                                                    </div>
                                                    </Link>        
                                                )
                                                )
                                            ):(<div>NOTHING</div>)
                                                
                                            }
                                        </div>
                                        </div>
                                    ) : 
                                    (
                                        <Link to={link?.path}>

                                        <p className={`${matchRoute(link?.path) ? "text-[#FFD60A]" : "text-[#DBDDEA]"}`}>
                                        {link?.title}
                                        </p>
                                        </Link>
                                    )
                                }
                            </li>
                        ))
                    }
                </ul>
            </nav>

            {/**Login/signup/Dashboard */}
            <div className='flex gap-x-4 items-center' ref={dropdownRef}>
                    {
                        user && user?.accountType != "Instructor" && (
                            <Link to="/dashboard/cart" className='relative'>
                                <AiOutlineShoppingCart className='text-white text-2xl'/>
                                {
                                    totalItems > 0 && (
                                        <span>
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link>
                        )
                    }
                    {
                        token===null && (
                            <Link to="/login">
                                <button className='border border-[rgb(44,51,63)] text-[rgb(175,178,191)] px-[12px] py-[8px] rounded-md bg-[rgb(22,29,41)] cursor-pointer'>
                                    Login
                                </button>
                            </Link>
                        )
                    }
                    {
                        token===null && (
                            <Link to="/signup">
                                <button className='border border-[rgb(44,51,63)] text-[rgb(175,178,191)] px-[12px] py-[8px] rounded-md bg-[rgb(22,29,41)] cursor-pointer'>
                                    Sign Up
                                </button>
                            </Link>
                        )
                    }
                    {
                        // token!==null && <ProfileDropDown/> && 
                        // <img src={user?.image} alt={`profile-${user?.firstName}`}
                        //         className='aspect-square w-[40px] rounded-full object-cover'
                        // />
                        token !== null &&(
                            <>
                                
                                <img src={user?.image} alt={`profile-${user?.firstName}`}
                                className='aspect-square w-[40px] rounded-full object-cover'
                                onClick={()=>setOpenr((prev)=>!prev)}
                                />   
                                {openr &&
                                <ProfileDropDown/>
                                }
                            </>
                        )
                        
                    

                        // <div className=''>
                        // <button className='px-3 py-2 bg-red-600 rounded-md'
                        // active={1}
                        // onClick={()=>dispatch(logout(navigate))}>
                        //     Logout
                        // </button>
                        // </div>
                    }
            </div>
        </div>
        </div>
    )
    }

    export default Navbar