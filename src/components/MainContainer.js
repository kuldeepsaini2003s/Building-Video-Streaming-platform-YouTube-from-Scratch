import React from "react";
import VideoContainer from "./VideoContainer";
import Categories from "./Categories";
import { useTheme } from "../utils/ThemeContext";
import Menu from "./Menu";

const MainContainer = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div
      className={`bg-${theme === "dark" ? "black" : "white"} text-${theme === "dark" ? "white" : "black"} pl-2 flex`}
    >
      <Menu/>
      <div>
      <Categories />
      <VideoContainer />
      </div>
    </div>
  );
};

export default MainContainer;
