import http from "./httpService";

export function submitBatch(data) {
  return http.post(`/api/batches`, data);
}

export function getBatches() {
  return http.get(`/api/batches`);
}


export function getTanks(){
  return http.get(`/api/tanks`);
}

export function getBatchById(id){
  return http.get(`/api/batches/${id}`);
}