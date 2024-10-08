import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: null,
  youtubevideo: null,
  singlevideo: null,
  youtubelogo: null,
  youtubecomments: null,
  fetchcategories:"",
  categories: null,
};
const videoSlice = createSlice({
  name: "vidoes",
  initialState,
  reducers: {
    videoslist: (state, action) => {
      state.videos = action.payload;
    },
    setYoutubeVideo: (state, action) => {
      state.youtubevideo = action.payload;
    },
    setSingleVideo: (state, action) => {
      state.singlevideo = action.payload;
    },
    setYoutubeLogo: (state, action) => {
      state.singleyoutubelogo = action.payload;
    },
    setYoutubeComments: ( state, action)=>{
      state.youtubecomments = action.payload;
    },
    setFetchCategories: (state, action) =>{
      state.fetchcategories = action.payload
    },
    setCategories: (state, action) =>{
      state.categories = action.payload
    }
  },
});

export const { videoslist, setYoutubeVideo, setSingleVideo, setYoutubeLogo, setYoutubeComments, setFetchCategories, setCategories } =videoSlice.actions;

export default videoSlice.reducer;
