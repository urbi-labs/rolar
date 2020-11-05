import http from "./httpService";

export function submitBatch(data) {
  return http.post(`/api/batch`, data);
}

export function getBatches() {
  return http.get(`/api/batch`);
}

export function notSampleBatches(tookSample) {
  return http.get(`/api/batch/non_sampled/${tookSample}`);
}

export function submitCent(data) {
  return http.post(`/api/cent`, data);
}

export function getCents(data) {
  return http.get(`/api/cent`, data);
}

export function submitMill(data) {
  return http.post(`/api/mill`, data);
}

export function getMills(data) {
  return http.get(`/api/mill`, data);
}

export function submitSample(data) {
  return http.post(`/api/samples`, data);
}

export function updateSample(data) {
  return http.put(`/api/samples`, data);
}

export function getSamples(data) {
  return http.get(`/api/samples`, data);
}

export function getTanks() {
  return http.get(`/api/tank`);
}
export function getAllTanks() {
  return http.get(`/api/tank/all`);
}

export function getBatchesByStatus(status) {
  return http.get(`/api/batch/status/${status}`);
}

export function submitStorage(data) {
  return http.post(`/api/storage`, data);
}
export function submitTank(data) {
  return http.post(`/api/closures`, data);
}
export function getStoragesFromTank(_tank) {
  return http.get(`/api/storage/tank/${_tank}`);
}

export function getByBatchId(route, id) {
  console.log(`get ${route}/${id}`);
  return http.get(`/api/${route}/batch/${id}`);
}

// export function updateStatus(id, data) {
//   return http.post(`/api/batch/${id}/update_status`, data);
// }

// export function tookSampleBatch(_id) {
//   return http.post(`/api/batch/tookSample/${_id}`);
// }
