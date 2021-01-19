import React from "react";
import Cent1 from "./cent/Cent1";
import Cent2 from "./cent/Cent2";

function validateStep1(payload) {
  const { _batch, productionLine } = payload;
  return !(productionLine && _batch);
}

function validateStep2(payload) {
  const { _tank, initialTemp, finalTemp, kneadingTime, pumpSpeed } = payload;
  return !(_tank && initialTemp && finalTemp && kneadingTime && pumpSpeed);
}

const Cent = ({
  data,
  step,
  submit,
  onComboChange,
  onInputChange,
  onCheckChange,
  handleCentSlider,
}) => {
  const { step: screen, payload } = data;
  const section = [
    <Cent1
      data={data}
      onComboChange={onComboChange}
      step={step}
      disabled={validateStep1(payload)}
    />,
    <Cent2
      step={step}
      submit={submit}
      data={data}
      onComboChange={onComboChange}
      onInputChange={onInputChange}
      onCheckChange={onCheckChange}
      handleCentSlider={handleCentSlider}
      disabled={validateStep2(payload)}
    />,
  ];
  return section[screen];
};

export default Cent;
