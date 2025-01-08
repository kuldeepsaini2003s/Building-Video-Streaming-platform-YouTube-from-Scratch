import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Menu from "./Menu";
import Categories from "./Categories";
import { useSelector } from "react-redux";
import Slider from "./Slider";

const Body = () => {
  const { user } = useSelector((store) => store.user);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const isSliderOpen = useSelector((store) => store.app.open);
  const location = window.location.pathname;

  useEffect(() => {
    setCategoryVisible(location === "/");
    setMenuVisible(location === "/watch");
  }, [location]);

  return (
    <div className="main-container">
      {!menuVisible && <Menu />}
      {categoryVisible && <Categories />}
      {isSliderOpen && <Slider />}
      <Outlet />
    </div>
  );
};

export default Body;
