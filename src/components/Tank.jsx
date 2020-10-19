import React from "react";
import Tank1 from "./tank/Tank1";
import Tank2 from "./tank/Tank2";

const Tank = ({ data, step, submit, onComboChange, onInputChange }) => {
  const { step: screen } = data;
  const section = [
    <Tank1 data={data} onComboChange={onComboChange} step={step} />,
    <Tank2 onComboChange={onComboChange} data={data} onInputChange={onInputChange} />,
  ];
  return section[screen];
};

export default Tank;
