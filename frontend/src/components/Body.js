import React from "react";
import { Outlet } from "react-router";
import Menu from "./Menu";
import Categories from "./Categories";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Slider from "./Slider";

const Body = () => {
  const { user } = useSelector((store) => store.user);
  const isSliderOpen = useSelector((store) => store.app.open);

  return (
    <div className="main-container">
      <Navbar />
      <Menu />
      {user && <Categories />}
      {isSliderOpen && <Slider />}
      <Outlet />
    </div>
  );
};

export default Body;
