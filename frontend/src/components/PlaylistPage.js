import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BACKEND_PLAYLIST } from "../utils/constants";
import useResponseHandler from "../hooks/UseResponseHandler";
import { FiChevronDown } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineLock } from "react-icons/md";
import { IoMdGlobe } from "react-icons/io";
import { BsPlusLg } from "react-icons/bs";
import { Check, LockKeyhole, Plus, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const visibilityOptions = [
  {
    name: "Public",
    msg: "Anyone can search for and view",
    icon: <IoMdGlobe className="text-[1.6rem]" />,
    icon2: <Check />,
  },
  {
    name: "Private",
    msg: "Only u can view",
    icon: <LockKeyhole size={22} />,
    icon2: <Check />,
  },
];

export const CreatePlaylist = ({ setShowCreatePlaylist }) => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const { handleResponse, handleError } = useResponseHandler();
  const [playlistData, setPlaylistData] = useState({
    title: "",
    status: "Private",
  });
  const [disable, setDisable] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlaylistData({ ...playlistData, [name]: value });
    setDisable(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, status } = playlistData;
    if (!title) {
      toast.error("Title can't be empty");
      setDisable(true);
      return;
    }
    const details = {
      title,
      status,
      videoId,
    };
    const toastId = toast.loading("Adding video to playlist...");
    try {
      const response = await axios.post(
        BACKEND_PLAYLIST + "/createPlaylist",
        details,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      handleResponse({
        status: response?.status,
        message: response?.data?.message,
        onSuccess: () => {
          setShowCreatePlaylist(false);
        },
        toastId,
      });
    } catch (error) {
      console.error("Error while creating playlist", error);
      handleError({
        error,
        toastId,
        message: error?.message,
      });
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleOptionSelect = (option) => {
    setPlaylistData({ ...playlistData, status: option });
    setIsDropdownOpen(true);
  };

  return (
    <div
      onClick={() => setShowCreatePlaylist(false)}
      className="absolute w-dvw h-dvh top-0 left-0 remove-scrollbar bg-black bg-opacity-30 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-icon_black rounded-md p-5 flex flex-col gap-5 justify-between"
      >
        <h1>New playlist</h1>
        <input
          className="py-3 px-2 border border-Lightblack  placeholder-Lightblack outline-none dark:bg-icon_black rounded-md"
          type="text"
          name="title"
          onChange={handleChange}
          placeholder="Choose a title"
        />
        <div
          onClick={toggleDropdown}
          className="relative flex justify-between border border-Lightblack py-1 items-center px-2  outline-none rounded-md"
        >
          <div className="flex flex-col">
            <span className="text-sm text-Lightblack">visibility</span>
            <p className="text-sm">{playlistData.status}</p>
          </div>
          <FiChevronDown />
          {isDropdownOpen && (
            <ul className="absolute z-10 w-[93%] translate-x-2 -bottom-[9.4rem] shadow-xl left-0 bg-white dark:bg-icon_black rounded-md mt-1">
              <h1 className="px-4 py-2 border-b border-Lightblack">
                Visibility
              </h1>
              {visibilityOptions.map((option) => (
                <li
                  key={option}
                  onClick={() => handleOptionSelect(option.name)}
                  className={`flex justify-between items-center px-2 py-2 text-sm font-medium hover:bg-gray-200 ${
                    playlistData.status === option.name &&
                    "dark:bg-hover_icon_black"
                  } ${
                    playlistData.status === "Private" && "rounded-b-md"
                  } dark:hover:bg-hover_icon_black cursor-pointer`}
                >
                  <div className="flex gap-2 items-center">
                    {option.icon}
                    <div>
                      <p className="text-sm">{option.name}</p>
                      <p className="text-Lightblack text-xs">{option.msg}</p>
                    </div>
                  </div>
                  {playlistData.status === option.name && option.icon2}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex gap-5">
          <button
            onClick={() => {
              setShowCreatePlaylist(false);
            }}
            className="px-10 py-1 border rounded-full hover:bg-hover_icon_black"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-10 py-1 border rounded-full dark:bg-white dark:text-black font-medium text-sm hover:bg-gray-300"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export const SavePlaylist = ({ setShowPlaylist, setShowCreatePlaylist }) => {
  useEffect(() => {
    try {
    } catch (error) {}
  }, []);

  return (
    <div
      onClick={() => setShowPlaylist(false)}
      className="absolute w-dvw h-dvh top-0 left-0 remove-scrollbar bg-black bg-opacity-30 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative dark:bg-icon_black rounded-md p-4 font-medium flex flex-col items-center gap-5"
      >
        <div className="flex justify-between items-center w-full ">
          <h1>Save video to...</h1>
          <X size={20} strokeWidth={1.25} />{" "}
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4 text-sm">
            <div className="custom-checkbox-container">
              <input type="checkbox" id="customCheckbox" />
              <label for="customCheckbox"></label>
            </div>
            <p>Watch later</p>
          </div>
          <LockKeyhole size={18} strokeWidth={2} />
        </div>
        <button
          onClick={() => {
            setShowCreatePlaylist(true);
            setShowPlaylist(false);
          }}
          className="px-6 py-2 rounded-full dark:bg-hover_icon_black dark:hover:bg-[#4D4D4D]  flex gap-2 items-center"
        >
          <Plus size={20} strokeWidth={2} />
          New playlist
        </button>
      </div>
    </div>
  );
};

const PlaylistPage = {
  CreatePlaylist,
  SavePlaylist,
};

export default PlaylistPage;
