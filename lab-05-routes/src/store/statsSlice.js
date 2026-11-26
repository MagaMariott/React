import { createSlice } from "@reduxjs/toolkit";
import { fetchStats } from "./signThunks.js";

const statsSlice = createSlice({
  name: "stats",
  initialState: {
    category: "all",
    data: null,
    status: "idle",
    error: "",
    requestId: "",
    fetchedAt: 0,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchStats.pending, (state, action) => {
        state.status = "pending";
        state.error = "";
        state.requestId = action.meta.requestId;
        if (state.category !== action.meta.arg) state.data = null;
        state.category = action.meta.arg;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.status = "fulfilled";
        state.data = action.payload;
        state.category = action.meta.arg;
        state.fetchedAt = Date.now();
        state.error = "";
      })
      .addCase(fetchStats.rejected, (state, action) => {
        if (action.meta.aborted || state.requestId !== action.meta.requestId) return;
        state.status = "rejected";
        state.error = action.payload || action.error.message || "The statistics could not be loaded.";
      });
  },
});

export default statsSlice.reducer;
