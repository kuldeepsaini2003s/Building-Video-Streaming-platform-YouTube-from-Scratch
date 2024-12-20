import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Body from "./Body";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const MainLayout = () => {
  const user = useSelector((store) => store.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <Body />
    </>
  );
};

export default MainLayout;
