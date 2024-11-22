import React from "react";
import { Outlet } from "react-router";
import Slider from "./Slider";
import { useSelector } from "react-redux";

const Body = () => {
  const isSliderOpen = useSelector((store) => store.app.open);
  return (
    <div className="flex">
      <Outlet />
      {isSliderOpen && <Slider />}      
    </div>
  );
};

export default Body;
