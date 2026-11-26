import { createSlice } from "@reduxjs/toolkit";
import { createSignRecord, fetchSign, updateLearned } from "./signThunks.js";

const detailSlice = createSlice({
  name: "detail",
  initialState: {
    id: "",
    sign: null,
    cachedAt: null,
    status: "idle",
    error: "",
    requestId: "",
    fetchedAt: 0,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSign.pending, (state, action) => {
        state.status = "pending";
        state.error = "";
        state.requestId = action.meta.requestId;
        if (state.id !== String(action.meta.arg)) {
          state.id = String(action.meta.arg);
          state.sign = null;
          state.cachedAt = null;
        }
      })
      .addCase(fetchSign.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.status = "fulfilled";
        state.sign = action.payload.sign;
        state.cachedAt = action.payload.cachedAt;
        state.id = String(action.payload.sign.id);
        state.fetchedAt = Date.now();
        state.error = "";
      })
      .addCase(fetchSign.rejected, (state, action) => {
        if (action.meta.aborted || state.requestId !== action.meta.requestId) return;
        state.status = "rejected";
        state.error = action.payload || action.error.message || "The sign could not be loaded.";
      })
      .addCase(createSignRecord.fulfilled, (state, action) => {
        state.id = String(action.payload.id);
        state.sign = action.payload;
        state.cachedAt = null;
        state.status = "fulfilled";
        state.error = "";
        state.fetchedAt = Date.now();
      })
      .addCase(updateLearned.fulfilled, (state, action) => {
        if (!state.sign || state.sign.id !== action.payload.id) return;
        state.sign = action.payload;
        state.status = "fulfilled";
        state.fetchedAt = Date.now();
        state.error = "";
      });
  },
});

export default detailSlice.reducer;
