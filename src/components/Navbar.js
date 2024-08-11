import React, { useEffect, useState } from "react";
import UseYoutubeVideos from "../hooks/UseYoutubeVideos";
import UserImage from "../Images/user-img.jpg";
import UseVideoCategories from "../hooks/UseVideoCategories";
import UseSearchSuggestions from "../hooks/UseSearchSuggestions";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuary } from "../utils/SearchSlice";
import { toggleSlider } from "../utils/appSlice";
import { IoMenu, IoSearchOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineMic, MdOutlineVideoCall } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import Youtube_Logo from "../Images/YouTube-Logo.wine.svg";

const Navbar = () => {
  UseYoutubeVideos();
  UseSearchSuggestions();
  UseVideoCategories();

  const [inputValue, setInputValue] = useState("");
  const [showSetting, setShowSetting] = useState(false);
  const [theme, setTheme] = useState("light");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dispatch = useDispatch();

  const getSuggestion = useSelector(
    (store) => store.searchSuggestion.searchQuery
  );
  console.log(searchResult);

  useEffect(() => {
    const timer = setInterval(() => {
      if (getSuggestion && Array.isArray(getSuggestion)) {
        setSearchResult(getSuggestion);
      }
    }, 200);
    return () => clearInterval(timer);
  }, [getSuggestion]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    dispatch(setSearchQuary(value));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.classList.add("className", savedTheme);
  }, []);

  const toggleTheme = (theme) => {
    setShowSetting(false);
    window.location.reload();
    setTheme(theme);
    document.body.setAttribute("className", theme);
    localStorage.setItem("theme", theme);
  };

  const settingHandler = () => {
    setShowSetting((prevShowSetting) => !prevShowSetting);
  };
  const handleToggle = () => {
    dispatch(toggleSlider());
  };

  const clearInput = () => {
    setInputValue("");
  };

  return (
    <>
      <div
        id="navbar"
        className="flex fixed z-10 h-14 px-4 sm:py-6 items-center w-full justify-between"
      >
        <div className="flex items-center gap-x-1 ml-2 ">
          {/* Menu-btn */}
          <IoMenu
            onClick={handleToggle}
            className="text-[2.7rem] hover:bg-lightgray dark:hover:bg-icon_black p-2 rounded-full"
          />
          {/* Youtube-logo */}
          {/* <img src={Youtube_Logo} alt="youtube"  className="h-fit"/> */}
        </div>

        {/* search-bar container  */}
        <div
          id="searchBar"
          className="flex items-center justify-between w-[52vw] relative"
        >
          <div className="flex items-center">
            {/* input-btn */}
            <div className="relative sm:block ms:hidden">
              <input
                id="input"
                type="text"
                autoComplete="off"
                placeholder="Search"
                value={inputValue}
                onChange={handleChange}
                className="group w-[42vw] h-[2.5rem] dark:bg-black  border border-gray dark:border-hover_icon_black  border-r-0 rounded-r-none rounded-3xl p-1 pl-5 focus:outline-none"
              />
              {/* X-btn */}
              {inputValue && (
                <button
                  onClick={clearInput}
                  className="absolute right-0 top-0 flex items-center hover:bg-gray hover:bg-hover_icon_black rounded-full p-1 my-1"
                >
                  <RxCross2 className="text-[1.4rem]" />
                </button>
              )}
            </div>
            {/* Search-btn */}
            <button
              id="search-btn"
              className="sm:rounded-3xl sm:rounded-l-none border-gray bg-lightgray hover:bg-gray dark:bg-icon_black dark:border-hover_icon_black sm:border h-[2.5rem] w-[5vw] pl-5 flex justify-center items-center sm:block ms:hidden"
            >
              <IoSearchOutline className="text-[1.3rem]" />
            </button>
          </div>
          {/* audio-btn */}
          <div className="flex items-center">
            <button
              id="audioBtn"
              className="rounded-full m-0 sm:block ms:hidden p-2 bg-lightgray hover:bg-gray dark:bg-icon_black dark:hover:bg-hover_icon_black"
            >
              <MdOutlineMic className="text-[1.4rem]" />
            </button>
          </div>
          {inputValue && (
            <div
              id="searchSuggestion"
              className="fixed font-medium dark:bg-black top-14 shadow-lg z-50 rounded-md w-[42vw]  py-4 bg-white"
            >
              {searchResult.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center dark:text-white font-semibold mb-2 gap-2 px-4 py-1 hover:bg-icon_black hover:text-black"
                >
                  <IoSearchOutline className="text-[1.2rem] mr-1" />
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:pr-2">
          <BsThreeDotsVertical
            onClick={settingHandler}
            className="text-[2.2rem] bg-lightgray hover:bg-gray dark:bg-icon_black dark:hover:bg-hover_icon_black rounded-full p-2"
          />
          <MdOutlineVideoCall className="text-[2.4rem] bg-lightgray hover:bg-gray dark:bg-icon_black dark:hover:bg-hover_icon_black rounded-full p-2" />
          {/* search btn for mobile screen */}
          <div className="sm:hidden">
            <button
              id="search-btn"
              className="sm:rounded-3xl sm:rounded-l-none sm:border sm:h-[2.5rem] sm:w-[5vw] flex justify-center items-center sm:p-0 ms:p-2 sm:hidden "
            >
              <svg
                viewBox="0 0 24 24"
                preserveAspectRatio="xMidYMid meet"
                focusable="false"
                className="style-scope yt-icon sm:h-5 ms:h-7 block"
              >
                <g className="style-scope yt-icon h-10">
                  <path
                    d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z"
                    className="style-scope yt-icon h-10"
                  ></path>
                </g>
              </svg>
            </button>
          </div>

          {/* user-icon */}
          <div
            id="user-icon"
            className=" py-2 flex gap-x-1 items-center  rounded-3xl sm:block ms:hidden "
          >
            <div
              className="h-9 w-9 rounded-full"
              style={{
                backgroundImage: `url(${UserImage})`,
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Theme Toggler */}
      {showSetting && (
        <div
          className=" w-[100vw] fixed z-20 h-[100vh] bg-black bg-opacity-40 top-0 "
          onClick={() => setShowSetting(false)}
        >
          <div className="floting fixed bg-white dark:bg-black sm:right-36 top-[4rem] ms:right-0 shadow-lg rounded-xl py-5">
            <div className="border-b border-gray pb-2 px-4 mb-3">
              <p className="text-sm m-0">
                Setting applies to this browser only
              </p>
            </div>
            <div>
              <h1
                className="slider-icon text-sm dark:hover:bg-icon_black px-4 py-2 my-2 w-max cursor-pointer"
                onClick={() => toggleTheme("dark")}
              >
                Dark Theme
              </h1>
              <p
                className="slider-icon text-sm  w-[99.9%] dark:hover:bg-icon_black px-4 py-2  w-max cursor-pointer"
                onClick={() => toggleTheme("light")}
              >
                Light Theme
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
