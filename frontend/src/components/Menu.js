import React, { useEffect } from "react";
import { IoMdHome } from "react-icons/io";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Menu = () => {
  const user = useSelector((store) => store.user.user);
  const menu = [
    {
      name: "Home",
      icon: <IoMdHome className="text-[1.4rem]" />,
      path: "/",
    },
    {
      name: "Shorts",
      icon: <SiYoutubeshorts className="text-[1.1rem]" />,
      path: "/shorts",
    },
    {
      name: "Subscribers",
      icon: <MdOutlineSubscriptions className="text-[1.3rem]" />,
      path: "/subscribedTo",
    },
    {
      name: "You",
      icon: <MdOutlineVideoLibrary className="text-[1.3rem]" />,
      path: `/${user?.userName}`,
    },
  ];

  const location = useLocation();
  console.log(location);

  return (
    <div className={`${location.pathname === "/watch" && "hidden"}`} id="sidebar">
      {/* home-btn */}
      {menu.map((item, index) => (
        <Link key={index} to={item?.path}>
          <div
            id="HomeBtn menu-items"
            className="flex flex-col items-center rounded-md hover:bg-Gray dark:hover:bg-icon_black ms:m-0 sm:py-3 ms:p-1 sm:w-full ms:w-fit "
          >
            {item?.icon}
            <p className="sm:text-xs ms:text-[12px] pt-1">{item?.name}</p>
          </div>
        </Link>
      ))}
      {/* user-icon */}
      {user && (
        <Link to={`/${user?.userName}`}>
          <div
            id="user-icon"
            className="flex flex-col justify-center items-center rounded-3xl sm:hidden ms:p-1"
          >
            <img
              src={user?.avatar}
              className="w-8 h-8 rounded-full object-cover object-center"
              alt=""
            />
            <p className="sm:text-xs ms:text-[12px]">You</p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Menu;
