import { createSlice } from "@reduxjs/toolkit";
import { createSignRecord, fetchSigns, updateLearned } from "./signThunks.js";

const signsSlice = createSlice({
  name: "signs",
  initialState: {
    result: null,
    query: null,
    queryKey: "",
    status: "idle",
    error: "",
    requestId: "",
    fetchedAt: 0,
    saveStatus: "idle",
    saveError: "",
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSigns.pending, (state, action) => {
        state.status = "pending";
        state.error = "";
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchSigns.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.status = "fulfilled";
        state.result = action.payload;
        state.query = action.meta.arg;
        state.queryKey = JSON.stringify(action.meta.arg);
        state.fetchedAt = Date.now();
        state.error = "";
      })
      .addCase(fetchSigns.rejected, (state, action) => {
        if (action.meta.aborted || state.requestId !== action.meta.requestId) return;
        state.status = "rejected";
        state.error = action.payload || action.error.message || "The list could not be loaded.";
      })
      .addCase(createSignRecord.pending, (state) => {
        state.saveStatus = "pending";
        state.saveError = "";
      })
      .addCase(createSignRecord.fulfilled, (state) => {
        state.saveStatus = "idle";
        state.saveError = "";
      })
      .addCase(createSignRecord.rejected, (state, action) => {
        state.saveStatus = "rejected";
        state.saveError = action.payload || action.error.message || "The sign could not be saved.";
      })
      .addCase(updateLearned.pending, (state) => {
        state.saveStatus = "pending";
        state.saveError = "";
      })
      .addCase(updateLearned.fulfilled, (state) => {
        state.saveStatus = "idle";
        state.saveError = "";
      })
      .addCase(updateLearned.rejected, (state, action) => {
        state.saveStatus = "rejected";
        state.saveError = action.payload || action.error.message || "The sign could not be updated.";
      });
  },
});

export default signsSlice.reducer;
