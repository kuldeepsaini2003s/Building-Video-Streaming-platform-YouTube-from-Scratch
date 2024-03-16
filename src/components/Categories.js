import React from 'react'
import { useTheme } from "../utils/ThemeContext";
const Categories = () => {
  const { theme, toggleTheme } = useTheme();
  const getInputBorderColor = () => {
    return theme === "dark" ? "gray" : "lightgray";
  };
  const getHoverBgColor = () => {
    return theme === "dark" ? "lightblack" : "lightgray";
  };
  return (
    <div className='overflow-x-auto fixed -z-50 top-[5rem] left-[5rem] w-full'>
    <div className='flex gap-3 m-2'>
        <div className={`text-${theme === "dark" ? "white" : "black"} bg-${getInputBorderColor()} px-3 py-2 h-10 rounded-xl hover:bg-${getHoverBgColor()} cursor-pointer text-sm font-semibold`}>All</div>
        <div className={`text-${theme === "dark" ? "white" : "black"} bg-${getInputBorderColor()} px-3 py-2 h-10 rounded-xl hover:bg-${getHoverBgColor()} cursor-pointer text-sm font-semibold`}>Mixes</div>
        <div className={`text-${theme === "dark" ? "white" : "black"} bg-${getInputBorderColor()} px-3 py-2 h-10 rounded-xl hover:bg-${getHoverBgColor()} cursor-pointer text-sm font-semibold`}>Gaming</div>
        <div className={`text-${theme === "dark" ? "white" : "black"} bg-${getInputBorderColor()} px-3 py-2 h-10 rounded-xl hover:bg-${getHoverBgColor()} cursor-pointer text-sm font-semibold`}>Music</div>
        <div className={`text-${theme === "dark" ? "white" : "black"} bg-${getInputBorderColor()} px-3 py-2 h-10 rounded-xl hover:bg-${getHoverBgColor()} cursor-pointer text-sm font-semibold`}>Live</div>
        <div className={`text-${theme === "dark" ? "white" : "black"} bg-${getInputBorderColor()} px-3 py-2 h-10 rounded-xl hover:bg-${getHoverBgColor()} cursor-pointer text-sm font-semibold`}>Street food</div>
        <div className={`text-${theme === "dark" ? "white" : "black"} bg-${getInputBorderColor()} px-3 py-2 h-10 rounded-xl hover:bg-${getHoverBgColor()} cursor-pointer text-sm font-semibold`}>Recently uploaded</div>
        <div className={`text-${theme === "dark" ? "white" : "black"} bg-${getInputBorderColor()} px-3 py-2 h-10 rounded-xl hover:bg-${getHoverBgColor()} cursor-pointer text-sm font-semibold`}>T-Series</div>
        <div className={`text-${theme === "dark" ? "white" : "black"} bg-${getInputBorderColor()} px-3 py-2 h-10 rounded-xl hover:bg-${getHoverBgColor()} cursor-pointer text-sm font-semibold`}>Carry minati</div>
    </div>
    </div>
  )
}

export default Categories