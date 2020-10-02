import http from "./httpService";

export function submitBatch(data) {
  return http.post(`/api/batches`, data);
}

export function getBatches() {
  return http.get(`/api/batches`);
}
