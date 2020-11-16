import React from "react";
import Storage1 from "./storage/Storage1";
import Storage2 from "./storage/Storage2";

function validateStep1(payload) {
  const { _batch } = payload;
  return !!!_batch;
}

function validateStep2(payload) {
  const { _tank, initialMeasure, finalMeasure } = payload;
  return !(_tank && initialMeasure && finalMeasure);
}

const Storage = ({
  data,
  step,
  submit,
  onComboChange,
  onInputChange,
  handleToggle,
  onCheckChange,
}) => {
  const { step: screen, payload } = data;
  const section = [
    <Storage1
      disabled={validateStep1(payload)}
      data={data}
      step={step}
      onComboChange={onComboChange}
    />,
    <Storage2
      disabled={validateStep2(payload)}
      data={data}
      step={step}
      submit={submit}
      handleToggle={handleToggle}
      onComboChange={onComboChange}
      onInputChange={onInputChange}
      onCheckChange={onCheckChange}
    />,
  ];
  return section[screen];
};

export default Storage;
