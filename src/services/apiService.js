import http from "./httpService";

export function saveDonations(data) {
  return http.post(`/api/donations`, data);
}

export function getOrigin(_id) {
  return http.get(`/api/origins/${_id}`);
}

export function getDonations() {
  return http.get(`/api/donations`);
}

export function getStats(_origin) {
  return http.get(`/api/donations/stats/${_origin}`);
}

export function getBlock(transactionID) {
  return http.get(`/api/donations/blockbytx/${transactionID}`);
}

export function getLastDonationByUserId(_user) {
  return http.get(`/api/donations/last/${_user}`);
}

export function getCurrentDraw() {
  return http.get(`/api/draws/current`);
}

export function getDraws() {
  return http.get(`/api/draws/`);
}

export function getTotals(_draw) {
  return http.get(`/api/draws/totals/${_draw}`);
}

export function getBallot(_draw) {
  return http.get(`/api/draws/ballot/${_draw}`);
}
