import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import {
  IoEyeOffOutline,
  IoEyeOutline,
  IoImageOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_VIDEO } from "../utils/constants";
import UseSingleVideo from "../hooks/UseSingleVideo";
import { useSelector } from "react-redux";

const UpdateVideo = () => {
  const { videoId } = useParams();
  UseSingleVideo(videoId);
  const getVideo = useSelector((store) => store.videos.singleVideo);
  const categories = [
    "Education",
    "Entertainment",
    "Gaming",
    "Music",
    "Animal",
    "Nature",
    "Cartoon",
    "Anime",
    "Tech",
    "Vlogs",
    "How-to & Style",
    "News & Politics",
    "Sports",
    "Travel & Events",
  ];

  const [formInput, setFormInput] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    thumbnail: null,
    video: null,
    videoName: "",
    status: true,
  });
  const [initialData, setInitialData] = useState();
  const [preview, setPreview] = useState(null);
  const [submissionDisable, setSubmissionDisable] = useState(false);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  useEffect(() => {
    if (getVideo) {
      const videoData = {
        title: getVideo?.title,
        description: getVideo?.description,
        category: getVideo?.category,
        tags: getVideo?.tags,
        thumbnail: getVideo?.thumbnail,
        video: getVideo?.videoUrl,
        videoName: getVideo?.videoName,
        status: true,
      };
      setTags(getVideo?.tags);
      setFormInput(getVideo);
      setInitialData(getVideo);
    }
  }, [getVideo]);

  const handleKeyDownImport = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (tag) {
        const newTag = tag.replace(/^#/, "");
        if (!tags.includes(newTag)) {
          setTags([...tags, `#${newTag}`]);
        }
      }
      setFormInput({ ...formInput, tags: "" });
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFormInput({ ...formInput, thumbnail: file });
    }
  };

  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormInput((prev) => ({
        ...prev,
        video: file,
        videoName: file.name,
      }));
    }
  };

  const removeVideo = () => {
    setFormInput({ ...formInput, video: null, videoName: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, category, thumbnail, video, status } =
      formInput;

    if (!title) {
      toast.error("Please enter a title");
      setSubmissionDisable(true);
      return;
    }
    if (!description) {
      toast.error("Please enter a description");
      setSubmissionDisable(true);
      return;
    }
    if (!category) {
      toast.error("Please enter a category");
      setSubmissionDisable(true);
      return;
    }
    if (!thumbnail) {
      toast.error("Please upload a thumbnail");
      setSubmissionDisable(true);
      return;
    }
    if (!video) {
      toast.error("Please upload a video");
      setSubmissionDisable(true);
      return;
    }

    if (formInput !== initialData) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("thumbnail", thumbnail);
      formData.append("video", video);
      formData.append("tags", tags);
      formData.append("status", status);

      const toastId = toast.loading("Creating video...");

      try {
        const response = await fetch(BACKEND_VIDEO + "/updateVideo", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          onUploadProgress: (data) => {
            console.log(data.loaded / data.total);
          },
        });
        const data = await response.json();
        if (
          response.status === 409 ||
          response.status === 403 ||
          response.status === 404 ||
          response.status === 500 ||
          response.status === 400
        ) {
          toast.update(toastId, {
            render: data.message,
            type: "error",
            isLoading: false,
            autoClose: 3000,
            pauseOnFocusLoss: false,
            closeOnClick: true,
          });
        }
        if (response.status === 200) {
          toast.update(toastId, {
            render: data.message,
            type: "success",
            isLoading: false,
            autoClose: 3000,
            pauseOnFocusLoss: false,
            closeOnClick: true,
          });
          navigate("/");
          setSubmissionDisable(false);
        }
      } catch (error) {
        console.log("Error while creating video", error);
        toast.update(toastId, {
          render: "Something went wrong while creating the video",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          pauseOnFocusLoss: false,
          closeOnClick: true,
        });
        setSubmissionDisable(false);
      }
    }
  };

  return (
    <div id="main" className="rounded-lg shadow-md px-6 pb-5">
      <h1 className="mb-3 text-2xl font-bold">Update Video</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Video File</label>
          <div className="relative">
            {formInput.video ? (
              <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                <div className="flex items-center gap-3">
                  <IoVideocamOutline className="w-5 h-5 text-blue-600" />
                  <span className="text-sm dark:text-blue-600">
                    {formInput.videoName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeVideo}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              >
                <IoVideocamOutline className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">MP4 (max. 1GB)</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoFile}
              className="hidden"
            />
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Video Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formInput.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border dark:bg-black rounded-md outline-none"
            placeholder="Enter your video title"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formInput.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md dark:bg-black outline-none"
            placeholder="Enter your video description"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category
          </label>
          <select
            value={formInput.category}
            name="category"
            onChange={handleInputChange}
            required
            className="w-full px-3 dark:bg-black py-2 border rounded-md outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {tags &&
                tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-blue-600"
                    >
                      <RxCross2 />
                    </button>
                  </span>
                ))}
            </div>
            <input
              type="text"
              name="tags"
              value={formInput.tags}
              onChange={handleInputChange}
              onKeyDown={handleKeyDownImport}
              placeholder="Add tags (press Enter, Space or comma to add)"
              className="w-full px-3 dark:bg-black py-2 border rounded-md outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Thumbnail</label>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Thumbnail preview"
                    className="max-h-48 mx-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setFormInput({ ...formInput, thumbnail: null });
                    }}
                    className="absolute top-2 right-2 bg-red-500 p-1 rounded-full hover:bg-red-600"
                  >
                    <RxCross2 />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="flex flex-col items-center gap-2">
                    <IoImageOutline className="w-10 h-10 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Click to upload thumbnail
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Visibility</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={formInput.status === true}
                onChange={() =>
                  setFormInput((prev) => ({ ...prev, status: true }))
                }
                className="w-4 h-4 text-blue-600"
              />
              <IoEyeOutline className="w-5 h-5" />
              <span>Public</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={formInput.status === false}
                onChange={() =>
                  setFormInput((prev) => ({ ...prev, status: false }))
                }
                className="w-4 h-4 text-blue-600"
              />
              <IoEyeOffOutline className="w-5 h-5" />
              <span>Private</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-5">
          <Link to={"/"}>
            <button className="border px-6 py-2 rounded-md hover:bg-[#E3E3E3] dark:hover:bg-icon_black">
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={submissionDisable}
            className="bg-red-600 px-6 py-2 rounded-md hover:bg-red-700"
          >
            Update Video
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateVideo;
