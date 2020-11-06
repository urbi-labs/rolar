import React from "react";
import Tank1 from "./tank/Tank1";
import Tank2 from "./tank/Tank2";

function validateStep1(payload) {
  const { _tank } = payload;
  return !_tank;
}

const Tank = ({
  data,
  step,
  submit,
  onComboChange,
  onInputChange,
  onComboChangeID,
  getStoragesFromTank,
}) => {
  const { step: screen, payload } = data;
  const section = [
    <Tank1
      disabled={validateStep1(payload)}
      data={data}
      step={step}
      onComboChangeID={onComboChangeID}
      onComboChange={onComboChange}
      getStoragesFromTank={getStoragesFromTank}
    />,
    <Tank2
      submit={submit}
      data={data}
      onComboChangeID={onComboChangeID}
      onComboChange={onComboChange}
      onInputChange={onInputChange}
      step={step}
    />,
  ];
  return section[screen];
};

export default Tank;
