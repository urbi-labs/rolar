import http from "./httpService";

export function saveBatch(data) {
  return http.post(`/api/batches`, data);
}
