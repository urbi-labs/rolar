import http from "./httpService";

export function submitBatch(data) {
  return http.post(`/api/batches`, data);
}

export function getBatches() {
  return http.get(`/api/batches`);
}

export function submitCent(data) {
  return http.post(`/api/centrifuges`, data);
}

export function getCents(data) {
  return http.get(`/api/centrifuges`, data);
}

export function submitMill(data) {
  return http.post(`/api/mills`, data);
}

export function getMills(data) {
  return http.post(`/api/mills`, data);
}

export function submitSample(data) {
  return http.post(`/api/mills`, data);
}

export function getSamples(data) {
  return http.post(`/api/mills`, data);
}


export function getTanks(){
  return http.get(`/api/tanks`);
}