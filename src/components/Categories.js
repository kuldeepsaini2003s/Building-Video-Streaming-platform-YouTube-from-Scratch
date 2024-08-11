import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setFetchCategories } from "../utils/VideoSlice";

const Categories = () => {
  const [active, setActive] = useState("All");
  const dispatch = useDispatch();
  const categories = [
    { name: "All", id: ""},
    { name: "Sports", id: "17"},
    { name: "Gaming", id: "20"},
    { name: "Travel", id: "19"},
    { name: "News", id: "25"},
    { name: "Music", id: "10"},
    { name: "Technology", id: "28"},
    { name: "Education", id: "27"},
    { name: "Movies", id: "30"},
    { name: "Horror", id: "39"},
    { name: "Entertainment", id: "24"},
    { name: "Cars", id: "2"},
  ];

  const videoTag = (tag) => {
    if (active !== tag) {
      setActive(tag);
      dispatch(setFetchCategories(tag.id));
    }
  };

  return (
    <div className="no-scrollbar overflow-x-auto fixed -z-50 sm:top-[4rem] sm:left-[6rem] ms:top-[3.6rem] ms:left-0 w-full ">
      <div className="flex sm:gap-3 ms:gap-2 sm:m-2 ms:my-2 ms:mx-1 items-center">
        {categories.map((item, index) => (
          <div
            key={index}
            onClick={() => videoTag(item)}
            className={`rounded-md bg-lightgray hover:bg-gray dark:bg-icon_black dark:hover:bg-hover_icon_black px-3 py-1 min-w-fit cursor-pointer text-sm font-semibold transition duration-200
              ${active.name === item.name ? "bg-[#000] text-white hover:bg-black dark:bg-white dark:hover:bg-white dark:text-black" : ""}`}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
