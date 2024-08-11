import { configureStore } from "@reduxjs/toolkit";
import videoSlice from "./VideoSlice";
import ChatSlice from "./ChatSlice";
import SearchSlice from "./SearchSlice";
import appSlice from "./appSlice";

const store = configureStore({
  reducer: {
    app: appSlice,
    videos: videoSlice,
    chat: ChatSlice,
    searchSuggestion: SearchSlice,
  },
});

export default store;
