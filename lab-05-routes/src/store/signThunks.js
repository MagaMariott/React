import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSign, getSign, getSignStats, getSigns, updateSign } from "../services/service.js";

function failureMessage(error, fallback) {
  if (error?.name === "AbortError") throw error;
  return error?.message || fallback;
}

export const fetchSigns = createAsyncThunk("signs/fetchList", async (query, { signal, rejectWithValue }) => {
  try {
    return await getSigns(query, signal);
  } catch (error) {
    return rejectWithValue(failureMessage(error, "The list could not be loaded."));
  }
});

export const fetchSign = createAsyncThunk("detail/fetch", async (id, { signal, rejectWithValue }) => {
  try {
    return await getSign(id, signal);
  } catch (error) {
    return rejectWithValue(failureMessage(error, "The sign could not be loaded."));
  }
});

export const fetchStats = createAsyncThunk("stats/fetch", async (category, { signal, rejectWithValue }) => {
  try {
    return await getSignStats(category, signal);
  } catch (error) {
    return rejectWithValue(failureMessage(error, "The statistics could not be loaded."));
  }
});

export const createSignRecord = createAsyncThunk("signs/create", async (draft, { dispatch, getState, rejectWithValue }) => {
  try {
    const sign = await createSign(draft);
    const state = getState();
    if (state.signs.query) dispatch(fetchSigns(state.signs.query));
    dispatch(fetchStats(state.stats.category || "all"));
    return sign;
  } catch (error) {
    return rejectWithValue(failureMessage(error, "The sign could not be saved."));
  }
});

export const updateLearned = createAsyncThunk("signs/updateLearned", async ({ id, changes }, { dispatch, getState, rejectWithValue }) => {
  try {
    const sign = await updateSign(id, changes);
    const state = getState();
    if (state.signs.query) dispatch(fetchSigns(state.signs.query));
    dispatch(fetchStats(state.stats.category || "all"));
    return sign;
  } catch (error) {
    return rejectWithValue(failureMessage(error, "The sign could not be updated."));
  }
});
