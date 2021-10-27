export function calcs(
  initialMeasure = 0,
  finalMeasure = 0,
  cone,
  tank,
  netWeight
) {
 
  const { doc } = tank;
  const { radius, cone: coneCapacity } = doc;


  const conevalue = cone ? coneCapacity : 0;
  const tot_cm = finalMeasure - initialMeasure;
  const tot_lt = conevalue + Math.PI * ((Math.pow(radius, 2) * (tot_cm/100))) * 1000;
  const oilWeight = tot_lt * 0.918; 

  console.log('CONSOLE TANK',tot_cm, finalMeasure, initialMeasure)

  const perf = oilWeight / netWeight;

  return {
    tot_cm,
    tot_lt,
    oilWeight,
    perf,
  };
}

export function calcs2(
  event,
  netWeight
) { 
  const { value: tot_lt } = event.target; 
  const oilWeight = tot_lt * 0.918;
  const perf = oilWeight / netWeight;

  return {
    oilWeight,
    perf,
  };
}

export function calcTotalLitres(array) {
  const totalLitres = array.reduce(
    (sum, actual) => sum + actual.totalLitres,
    0
  );
  return Math.round(totalLitres * 100) / 100;
}

// export async function getStoragesFromTank(_tank) {
//   const { data: storages } = await getStoragesFromTank(_tank);
//   const newState = { ...this.state };
//   const items = [];

//   storages.forEach((elem, index) => {
//     items.push(elem);
//   });
//   newState["tank"].payload["batchArray"] = items;
//   this.setState(newState, () => console.log(this.state));
// }
