import React from "react";
import Cent1 from "./cent/Cent1";
import Cent2 from "./cent/Cent2";

const Cent = ({ data, step, submit, onComboChange, onInputChange }) => {
  const { step: screen } = data;
  const section = [
    <Cent1 data={data} onComboChange={onComboChange} step={step} />,
    <Cent2 />,
  ];
  return section[screen];
};

export default Cent;
