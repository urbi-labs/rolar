export async function calcs(
  initialMeasure = 0,
  finalMeasure = 0,
  cone,
  tank,
  netWeight
) {
  const { doc } = tank;
  const { radius } = doc;
  console.log({ doc });

  const tot_cm = finalMeasure - initialMeasure;
  const tot_lt =
    cone + Math.PI * ((Math.pow(radius / 1000, 2) * tot_cm) / 1000) * 1000;
  const oilWeight = tot_lt * 0.92;

  const perf = oilWeight / netWeight;
  return {
    tot_cm,
    tot_lt,
    oilWeight,
    perf,
  };
}
