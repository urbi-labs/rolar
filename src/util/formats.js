export function fecha() {
  const date = new Date();
  date.setHours(date.getHours() + 3);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function hora() {
  const date = new Date();
  return `${date.getHours()}:${date.getMinutes()}`;
}

const optionsDayTime = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

export function dayTime(ISODate) {
  if (ISODate === "-") return "No disponible.";
  return new Date(ISODate).toLocaleDateString("es-AR", optionsDayTime);
}

export function shortDate(date) {
  return new Date(date).toLocaleDateString("es-AR", {
    month: "numeric",
    day: "numeric",
  });
}

export function isoFormatDMY(d) {
  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }
  return (
    pad(d.getUTCDate()) +
    "/" +
    pad(d.getUTCMonth() + 1) +
    "/" +
    d.getUTCFullYear()
  );
}
