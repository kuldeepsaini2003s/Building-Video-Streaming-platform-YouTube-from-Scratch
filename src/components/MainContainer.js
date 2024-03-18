import React from "react";
import VideoContainer from "./VideoContainer";
import Categories from "./Categories";
import Menu from "./Menu";

const MainContainer = () => {
  return (
    <div
      className= "pl-2 flex"
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
