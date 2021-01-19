import http from "./httpService";

// batch calls

export function submitBatch(data) {
  return http.post(`/api/batch`, data);
}

export function updateBatch(data) {
  return http.put(`/api/batch`, data);
}

export function getBatches() {
  return http.get(`/api/batch`);
}

export function notSampleBatches(tookSample) {
  return http.get(`/api/batch/non_sampled/${tookSample}`);
}

export function getBatchById(id) {
  if (!id) return;
  return http.get(`/api/batch/${id}`);
}

export function getBatchesByStatus(status) {
  return http.get(`/api/batch/status/${status}`);
}

// samples calls
export function submitSample(data) {
  return http.post(`/api/samples`, data);
}

export function updateSample(data) {
  return http.put(`/api/samples`, data);
}

export function getSamples(data) {
  return http.get(`/api/samples`, data);
}

// mills calls

export function submitMill(data) {
  return http.post(`/api/mill`, data);
}

export function updateMill(data) {
  return http.put(`/api/mill`, data);
}

export function getMills(data) {
  return http.get(`/api/mill`, data);
}

// centrifuge calls

export function submitCent(data) {
  return http.post(`/api/cent`, data);
}

export function updateCent(data) {
  return http.put(`/api/cent`, data);
}

export function getCents(data) {
  return http.get(`/api/cent`, data);
}

export function getCentByTankId(id) {
  if (!id) return;
  return http.get(`/api/cent/batch/${id}`);
}

// storage calls
export function submitStorage(data) {
  return http.post(`/api/storage`, data);
}

export function updateStorage(data) {
  return http.put(`/api/storage`, data);
}

export function getStoragesByTank(_tank) {
  if (!_tank) return;
  return http.get(`/api/storage/tank/${_tank}`);
}

// tanks calls

export function getTanks() {
  return http.get(`/api/tank`);
}

export function getActiveTanks() {
  return http.get(`/api/tank/active`);
}

export function submitTank(data) {
  return http.post(`/api/closures`, data);
}

export function updateTank(data) {
  return http.put(`/api/closures`, data);
}

export function getByBatchId(route, id) {
  console.log(`get ${route}/${id}`);
  if (!id) return;
  return http.get(`/api/${route}/batch/${id}`);
}

// export function updateStatus(id, data) {
//   return http.post(`/api/batch/${id}/update_status`, data);
// }

// export function tookSampleBatch(_id) {
//   return http.post(`/api/batch/tookSample/${_id}`);
// }
