import { createSelector } from "@reduxjs/toolkit";

const FRESH_MS = 60_000;

export function isFresh(status, fetchedAt) {
  return status === "fulfilled" && Date.now() - fetchedAt < FRESH_MS;
}

export const selectSignListView = createSelector(
  [(state) => state.signs.result, (state) => state.signs.status, (state) => state.signs.error],
  (result, status, error) => ({
    data: result,
    error: error ? { message: error } : null,
    isPending: status === "pending" && !result,
    isFetching: status === "pending" && Boolean(result),
    isError: status === "rejected",
    isSuccess: status === "fulfilled" || (status === "pending" && Boolean(result)),
  }),
);

export const selectDetailView = createSelector(
  [(state) => state.detail.sign, (state) => state.detail.cachedAt, (state) => state.detail.status, (state) => state.detail.error],
  (sign, cachedAt, status, error) => ({
    data: sign ? { sign, cachedAt } : undefined,
    error: error ? { message: error } : null,
    isPending: status === "pending" && !sign,
    isError: status === "rejected",
    isSuccess: status === "fulfilled" || (status === "pending" && Boolean(sign)),
  }),
);

export const selectStatsView = createSelector(
  [(state) => state.stats.data, (state) => state.stats.status, (state) => state.stats.error],
  (data, status, error) => ({
    data,
    error: error ? { message: error } : null,
    isPending: status === "pending" && !data,
    isFetching: status === "pending" && Boolean(data),
    isError: status === "rejected",
    isSuccess: status === "fulfilled" || (status === "pending" && Boolean(data)),
  }),
);

export const selectLearnedShare = createSelector([(state) => state.stats.data], (data) => {
  if (!data?.total) return 0;
  return Math.round((data.learned / data.total) * 100);
});

export const selectSaveState = createSelector(
  [(state) => state.signs.saveStatus, (state) => state.signs.saveError],
  (saveStatus, saveError) => ({
    isPending: saveStatus === "pending",
    isError: saveStatus === "rejected",
    error: saveError ? { message: saveError } : null,
  }),
);
