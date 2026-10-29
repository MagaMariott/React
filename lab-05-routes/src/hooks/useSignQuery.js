import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { categoryOptions } from "../labels.js";

const categories = new Set(["all", ...categoryOptions.map((item) => item.value)]);
const progressValues = new Set(["all", "learned", "learning"]);
const sortValues = new Set(["name", "name-desc", "code", "code-desc"]);

function read(params) {
  const category = params.get("category") || "all";
  const progress = params.get("progress") || "all";
  const sort = params.get("sort") || "name";
  const page = Number(params.get("page"));
  return {
    search: params.get("search") ?? "",
    category: categories.has(category) ? category : "all",
    progress: progressValues.has(progress) ? progress : "all",
    sort: sortValues.has(sort) ? sort : "name",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

function toParams(query) {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.category !== "all") params.set("category", query.category);
  if (query.progress !== "all") params.set("progress", query.progress);
  if (query.sort !== "name") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  return params;
}

export function useSignQuery() {
  const [params, setParams] = useSearchParams();
  const query = useMemo(() => read(params), [params]);

  const update = useCallback(
    (patch, { replace = false } = {}) => {
      const next = { ...query, ...patch };
      if (!Object.prototype.hasOwnProperty.call(patch, "page")) next.page = 1;
      setParams(toParams(next), { replace });
    },
    [query, setParams],
  );

  return { query, update };
}
