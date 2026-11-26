import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSignRecord, fetchSign, fetchSigns, fetchStats, updateLearned } from "../store/signThunks.js";
import { isFresh, selectDetailView, selectSaveState, selectSignListView, selectStatsView } from "../store/selectors.js";

export function useSignList(query) {
  const dispatch = useDispatch();
  const view = useSelector(selectSignListView);
  const queryKey = useSelector((state) => state.signs.queryKey);
  const status = useSelector((state) => state.signs.status);
  const fetchedAt = useSelector((state) => state.signs.fetchedAt);
  const nextKey = JSON.stringify(query);

  useEffect(() => {
    if (queryKey === nextKey && isFresh(status, fetchedAt)) return undefined;
    const promise = dispatch(fetchSigns(query));
    return () => promise.abort();
  }, [dispatch, nextKey]);

  const refetch = useCallback(() => dispatch(fetchSigns(query)), [dispatch, query]);
  return { ...view, refetch };
}

export function useSignDetail(id) {
  const dispatch = useDispatch();
  const view = useSelector(selectDetailView);
  const currentId = useSelector((state) => state.detail.id);
  const status = useSelector((state) => state.detail.status);
  const fetchedAt = useSelector((state) => state.detail.fetchedAt);

  useEffect(() => {
    if (currentId === String(id) && isFresh(status, fetchedAt)) return undefined;
    const promise = dispatch(fetchSign(id));
    return () => promise.abort();
  }, [dispatch, id]);

  const refetch = useCallback(() => dispatch(fetchSign(id)), [dispatch, id]);
  return { ...view, refetch };
}

export function useSignStats(category) {
  const dispatch = useDispatch();
  const view = useSelector(selectStatsView);
  const current = useSelector((state) => state.stats.category);
  const status = useSelector((state) => state.stats.status);
  const fetchedAt = useSelector((state) => state.stats.fetchedAt);

  useEffect(() => {
    if (current === category && isFresh(status, fetchedAt)) return undefined;
    const promise = dispatch(fetchStats(category));
    return () => promise.abort();
  }, [dispatch, category]);

  const refetch = useCallback(() => dispatch(fetchStats(category)), [dispatch, category]);
  return { ...view, refetch };
}

export function useCreateSign() {
  const dispatch = useDispatch();
  const save = useSelector(selectSaveState);

  const mutate = useCallback(
    (draft, { onSuccess } = {}) => {
      dispatch(createSignRecord(draft))
        .unwrap()
        .then((sign) => onSuccess?.(sign))
        .catch(() => {});
    },
    [dispatch],
  );

  return { ...save, mutate };
}

export function useUpdateSign() {
  const dispatch = useDispatch();
  const save = useSelector(selectSaveState);

  const mutate = useCallback(
    ({ id, changes }) => {
      dispatch(updateLearned({ id, changes }));
    },
    [dispatch],
  );

  return { ...save, mutate };
}
