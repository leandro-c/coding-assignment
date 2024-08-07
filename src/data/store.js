import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./moviesSlice";
import starredSlice from "./starredSlice";
import watchLaterSlice from "./watchLaterSlice";

const store = configureStore({
  reducer: {
    movies: moviesReducer,
    starred: starredSlice.reducer,
    watchLater: watchLaterSlice.reducer,
  },
});

export default store;
