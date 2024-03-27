import { configureStore } from "@reduxjs/toolkit";
import videoSlice from "./VideoSlice";
import ChatSlice from "./ChatSlice";

const store = configureStore({
  reducer: {
    videos: videoSlice,
    chat: ChatSlice,
  },
});

export default store;
