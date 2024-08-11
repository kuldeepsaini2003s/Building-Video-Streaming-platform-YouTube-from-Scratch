import React from "react";
import UserImage from "../Images/user-img.jpg";
import { IoMdHome } from "react-icons/io";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdOutlineVideoLibrary } from "react-icons/md";

const menu = [
  {
    name: "Home",
    icon: <IoMdHome className="text-[1.4rem]" />,
  },
  {
    name: "Shorts",
    icon: <SiYoutubeshorts className="text-[1.1rem]" />,
  },
  {
    name: "Subscribers",
    icon: <MdOutlineSubscriptions className="text-[1.3rem]" />,
  },
  {
    name: "You",
    icon: <MdOutlineVideoLibrary className="text-[1.3rem]" />,
  },
];

const Menu = () => {
  return (
    <div
      id="sideMenu"
      className="dark:text-white dark:bg-black sm:w-[5rem] ms:w-full fixed -z-40 sm:left-1 sm:top-[2.5rem] sm:bottom-0 ms:-bottom-2 sm:h-full flex sm:flex-col items-center sm:gap-2 sm:py-5 sm:p-2  ms:h-16  sm:justify-normal ms:justify-between ms:px-2 ms:pb-3 ms:py-2 ms:left-0 sm:bg-white ms:text-white ms:bg-black"
    >
      {/* home-btn */}
      {menu.map((item, index) => (
        <div
          id="HomeBtn menu-items"
          className="flex flex-col items-center rounded-md text-black dark:text-white hover:bg-gray dark:hover:bg-icon_black ms:m-0 sm:py-3 ms:p-1 sm:w-full ms:w-fit "
        >
          {item.icon}
          <p className="sm:text-xs ms:text-[12px] pt-1">{item.name}</p>
        </div>
      ))}
      {/* user-icon */}
      <div
        id="user-icon"
        className="flex flex-col justify-center items-center rounded-3xl sm:hidden ms:p-1"
      >
        <div
          className="h-8 w-8 rounded-full"
          style={{
            backgroundImage: `url(${UserImage})`,
            backgroundSize: "cover",
          }}
        ></div>
        <p className="sm:text-xs ms:text-[12px]">You</p>
      </div>
    </div>
  );
};

export default Menu;
