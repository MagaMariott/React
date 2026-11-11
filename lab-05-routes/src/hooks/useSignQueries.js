import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSign, getSign, getSignStats, getSigns, updateSign } from "../services/service.js";

export const signKeys = {
  list: (query) => ["signs", "list", query],
  detail: (id) => ["signs", "detail", String(id)],
  stats: (category) => ["signs", "stats", category],
};

export function useSignList(query) {
  return useQuery({
    queryKey: signKeys.list(query),
    queryFn: ({ signal }) => getSigns(query, signal),
  });
}

export function useSignDetail(id) {
  return useQuery({
    queryKey: signKeys.detail(id),
    queryFn: ({ signal }) => getSign(id, signal),
  });
}

export function useSignStats(category) {
  return useQuery({
    queryKey: signKeys.stats(category),
    queryFn: ({ signal }) => getSignStats(category, signal),
  });
}

export function useCreateSign() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (draft) => createSign(draft),
    onSuccess(sign) {
      client.setQueryData(signKeys.detail(sign.id), sign);
      client.invalidateQueries({ queryKey: ["signs", "list"] });
      client.invalidateQueries({ queryKey: ["signs", "stats"] });
    },
  });
}

export function useUpdateSign() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changes }) => updateSign(id, changes),
    onSuccess(sign) {
      client.setQueryData(signKeys.detail(sign.id), sign);
      client.invalidateQueries({ queryKey: ["signs", "list"] });
      client.invalidateQueries({ queryKey: ["signs", "stats"] });
    },
  });
}
