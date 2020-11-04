import http from "./httpService";

export function submitBatch(data) {
  return http.post(`/api/batches`, data);
}

export function getBatches() {
  return http.get(`/api/batches`);
}

export function notSampleBatches(tookSample) {
  return http.get(`/api/batches/non_sampled/${tookSample}`);
}

export function tookSampleBatch(_id) {
  return http.post(`/api/batches/tookSample/${_id}`);
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
  return http.get(`/api/mills`, data);
}

export function submitSample(data) {
  return http.post(`/api/samples`, data);
}

export function getSamples(data) {
  return http.get(`/api/samples`, data);
}

export function getTanks() {
  return http.get(`/api/tanks`);
}
export function getAllTanks() {
  return http.get(`/api/tanks/all`);
}

export function updateStatus(id, data) {
  return http.post(`/api/batches/${id}/update_status`, data);
}

export function getBatchesByStatus(status) {
  return http.get(`/api/batches/status/${status}`);
}

export function submitStorage(data) {
  return http.post(`/api/storages`, data);
}
export function submitTank(data) {
  return http.post(`/api/closures`, data);
}
export function getStoragesFromTank(_tank) {
  return http.get(`/api/storages/tank/${_tank}`);
}

export function getByBatchId(route, id) {
  console.log(`get ${route}/${id}`);
  return http.get(`/api/${route}/batch/${id}`);
}
