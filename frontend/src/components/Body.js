import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Menu from "./Menu";
import Categories from "./Categories";
import { useSelector } from "react-redux";
import Slider from "./Slider";

const Body = () => {
  const { user } = useSelector((store) => store.user);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const isSliderOpen = useSelector((store) => store.app.open);
  const location = window.location.pathname;

  useEffect(() => {
    setCategoryVisible(location === "/");
  }, [location]);

  return (
    <div className="main-container">
      <Menu />
      {categoryVisible && <Categories />}
      {isSliderOpen && <Slider />}
      <Outlet />
    </div>
  );
};

export default Body;
