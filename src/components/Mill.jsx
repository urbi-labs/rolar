import React from "react";
import Mill1 from "./mill/Mill1";
import Mill2 from "./mill/Mill2";

function validateStep1(payload) {
  const { _batch, productionLine } = payload;
  return !(productionLine && _batch);
}

function validateStep2(payload) {
  const { sieve, microtalcum, enzymes } = payload;
  return !(sieve && microtalcum && enzymes);
}

const Mill = ({
  data,
  step,
  submit,
  onComboChange,
  onInputChange,
  onCheckChange,
  handleMillSlider,
}) => {
  const { step: screen, payload } = data;
  const section = [
    <Mill1
      data={data}
      onComboChange={onComboChange}
      step={step}
      disabled={validateStep1(payload)}
    />,
    <Mill2
      step={step}
      submit={submit}
      data={data}
      onComboChange={onComboChange}
      onInputChange={onInputChange}
      onCheckChange={onCheckChange}
      handleMillSlider={handleMillSlider}
      disabled={validateStep2(payload)}
    />,
  ];
  return section[screen];
};

export default Mill;
