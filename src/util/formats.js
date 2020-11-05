export function fecha() {
  const date = new Date();
  date.setHours(date.getHours() + 3);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function hora() {
  const date = new Date();
  return `${date.getHours()}:${date.getMinutes()}`;
}

export function formatID(batch) {
  const { timestamp, _id } = batch;

  const id = _id.slice(-5);

  const time = shortDate(timestamp);

  return `${time} (#${id.toUpperCase()})`;
}

export function shortDate(date) {
  return new Date(date).toLocaleDateString("es-AR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
  });
}

// const optionsDayTime = {
//   year: "numeric",
//   month: "numeric",
//   day: "numeric",
//   hour: "numeric",
//   minute: "numeric",
//   second: "numeric",
// };

// export function dayTime(ISODate) {
//   if (ISODate === "-") return "No disponible.";
//   return new Date(ISODate).toLocaleDateString("es-AR", optionsDayTime);
// }

// export function isoFormatDMY(d) {
//   function pad(n) {
//     return (n < 10 ? "0" : "") + n;
//   }
//   return (
//     pad(d.getUTCDate()) +
//     "/" +
//     pad(d.getUTCMonth() + 1) +
//     "/" +
//     d.getUTCFullYear()
//   );
// }
