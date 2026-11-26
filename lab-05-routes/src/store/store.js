import { configureStore } from "@reduxjs/toolkit";
import detailReducer from "./detailSlice.js";
import signsReducer from "./signsSlice.js";
import statsReducer from "./statsSlice.js";

export const store = configureStore({
  reducer: {
    signs: signsReducer,
    detail: detailReducer,
    stats: statsReducer,
  },
});
