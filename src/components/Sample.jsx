import React from "react";
import Sample1 from "./sample/Sample1";
import Sample2 from "./sample/Sample2";

function validateStep1(payload) {
  const { _batch } = payload;
  return !_batch;
}

function validateStep2(payload) {
  const {
    hidraulicOil,
    frost,
    mummified,
    dehydrated,
    beaten,
    waterExcess,
    branchExcess,
    leafExcess,
    maturityIndex,
    moisturePase,
    wetFat,
    dryFat,
    taurusPomace,
    rexPomace,
  } = payload;
  return !(
    frost &&
    mummified &&
    dehydrated &&
    beaten &&
    waterExcess &&
    branchExcess &&
    leafExcess &&
    maturityIndex &&
    moisturePase &&
    wetFat &&
    dryFat &&
    taurusPomace &&
    rexPomace
  );
}

const Sample = ({
  data,
  step,
  submit,
  onComboChange,
  onInputChange,
  handleToggle,
}) => {
  const { step: screen, payload } = data;
  const section = [
    <Sample1
      step={step}
      data={data}
      onComboChange={onComboChange}
      disabled={validateStep1(payload)}
    />,
    <Sample2
      step={step}
      submit={submit}
      data={data}
      onComboChange={onComboChange}
      onInputChange={onInputChange}
      handleToggle={handleToggle}
      disabled={validateStep2(payload)}
    />,
  ];
  return section[screen];
};

export default Sample;
