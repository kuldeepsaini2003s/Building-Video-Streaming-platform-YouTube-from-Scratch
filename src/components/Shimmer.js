import React, { useEffect, useState } from "react";

const Shimmer = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = (theme) => {
    window.location.reload();
    setTheme(theme);
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };
  return (
    <div className="shimmer-bg flex flex-col gap-20 pl-20">
      {/* navbar container  */}
      <div className="shimmer-border flex pl-60 p-5 justify-between border-b border-[#E3E3E3]">
      <div className="flex items-center">
        {/* input-btn */}
        <div className="relative">
          <input
            id="input"
            type=""
            className="w-[42vw] h-[2.5rem] border-r-none border-gray rounded-r-none rounded-3xl p-1 pl-5 focus:outline-none"
          />
        </div>

        {/* Search-btn */}
        <button
          className="shimmer shimmer-input rounded-3xl rounded-l-none border bg-[#E3E3E3] border-gray h-[2.5rem] w-[5vw] flex justify-center items-center"
        ></button>
      </div>
      <div className="flex justify-end items-center gap-3">
        <div className="shimmer bg-[#E3E3E3] rounded-full p-4 w-5 h-5"></div>
        <div className="shimmer bg-[#E3E3E3] rounded-full p-4 w-5 h-5"></div>
        <div className="shimmer bg-[#E3E3E3] rounded-full p-4 w-5 h-5"></div>
      </div>
      </div>

      {/* main container */}
      <div className="shimmer-border flex border-t pl-6 flex-wrap gap-x-4 gap-y-8  border-[#E3E3E3] p-4">
        {/* video-container */}

        {Array(30)
          .fill(" ")
          .map((e, index) => (
            <>
              <div>
                {/* img */}
                <div className="shimmer h-[35vh] w-[28vw] rounded-xl bg-gray"></div>

                <div className="flex p-2 gap-3">
                  {/* channdel */}
                  <div className="shimmer bg-[#E3E3E3] rounded-full p-4 w-5 h-5"></div>
                  {/* title */}
                  <div className="flex flex-col gap-2">
                    <div className="shimmer bg-[#E3E3E3] rounded-sm h-5 w-[17rem]"></div>
                    <div className="shimmer bg-[#E3E3E3] rounded-sm h-5 w-[11rem]"></div>
                  </div>
                </div>
              </div>
            </>
          ))}
      </div>
    </div>
  );
};

export default Shimmer;
