import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Body from "./Body";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Shimmer from "./Shimmer";

const MainLayout = () => {
  const user = useSelector((store) => store.user.user);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
    if (!token) {
      setLoading(false);
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <Shimmer />
      ) : (
        <>
          <Navbar />
          <Body />
        </>
      )}
    </>
  );
};

export default MainLayout;
