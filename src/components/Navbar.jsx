import React, { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { SearchContext } from "./SearchContext";
import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineUser,
  AiOutlineSearch,
  AiOutlineBarChart,
} from "react-icons/ai";
import { IoHomeOutline, IoAlbumsOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { MdFavoriteBorder } from "react-icons/md";
import logo from "../icon/allD_icon.png";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const { searchTerm, setSearchTerm } = useContext(SearchContext);

  const navigate = useNavigate();
  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <>
      <div className="flex justify-between items-center h-20 max-w-full mx-auto px-4 text-black bg-white">
        <img src={logo} className="w-[50px] h-[50px]" />
        <h1 className="w-full text-3xl font-bold text-[#00df9a] flex justify-start">
          All-D.
        </h1>
        <div className=" bg-gray-500 w-[350px] rounded-md h-100 flex items-center px-3">
          <button>
            <AiOutlineSearch
              style={{
                color: "black",
              }}
            />
          </button>
          <input
            className="bg-gray-500 border-none h-100 w-[100%] ml-1 text-[black] outline-none"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.trim()) {
                navigate(`/search?query=${e.target.value.trim()}`);
              }
            }}
          />
        </div>
        <ul className="hidden md:flex">
          <li className="p-4 w-max">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-black border-b-2 border-yellow-400"
                  : "text-black hover:text-gray-300"
              }
            >
              Home Page
            </NavLink>
          </li>
          <li className="p-4 w-max">
            <NavLink
              to="/Albums"
              className={({ isActive }) =>
                isActive
                  ? "text-black border-b-2 border-yellow-400"
                  : "text-black hover:text-gray-300"
              }
            >
              Albums
            </NavLink>
          </li>
          <li className="p-4 w-max">
            <NavLink
              to="/AllImage"
              className={({ isActive }) =>
                isActive
                  ? "text-black border-b-2 border-yellow-400"
                  : "text-black hover:text-gray-300"
              }
            >
              All Image
            </NavLink>
          </li>
          <li className="p-4 w-max">
            <NavLink
              to="/Favorite"
              className={({ isActive }) =>
                isActive
                  ? "text-black border-b-2 border-yellow-400"
                  : "text-black hover:text-gray-300"
              }
            >
              Favorite
            </NavLink>
          </li>
          <li className="p-4 w-max">
            <NavLink
              to="/Graph"
              className={({ isActive }) =>
                isActive
                  ? "text-black border-b-2 border-yellow-400"
                  : "text-black hover:text-gray-300"
              }
            >
              Charts
            </NavLink>
          </li>
        </ul>
        <div onClick={handleNav} className="md:hidden ">
          <div className="px-2">
            {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
          </div>
        </div>
        <AiOutlineUser size={60} />
        <ul
          className={`fixed inset-y-0 right-0 w-[60%] bg-black text-white p-6 space-y-4 transform transition-transform duration-300 ease-in-out ${
            nav ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <div onClick={handleNav} className="flex ">
            {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
          </div>
          <li className="flex items-center p-4 border-b border-gray-600">
            <IoHomeOutline size={20} />
            <NavLink to="/">Home Page</NavLink>
          </li>
          <li className="flex items-center p-4 border-b border-gray-600">
            <IoAlbumsOutline size={20} />
            <NavLink to="/Albums">Albums</NavLink>
          </li>
          <li className="flex items-center p-4 border-b border-gray-600">
            <CiImageOn size={20} />
            <NavLink to="/AllImage">All Image</NavLink>
          </li>
          <li className="flex items-center p-4 border-b border-gray-600">
            <MdFavoriteBorder size={20} />
            <NavLink to="/Favorite">Favorite</NavLink>
          </li>
          <li className="flex items-center p-4 border-b border-gray-600">
            <AiOutlineBarChart size={20} />
            <NavLink to="/Graph">Charts</NavLink>
          </li>
        </ul>
      </div>
      <Outlet />
    </>
  );
};

export default Navbar;
