import React from "react";
import Sample1 from "./sample/Sample2";
import Sample2 from "./sample/Sample2";

const Sample = ({ data, step, submit, onComboChange, onInputChange }) => {
  const { step: screen } = data;
  const section = [
    <Sample1 data={data} onComboChange={onComboChange} step={step} />,
    <Sample2 />,
  ];
  return section[screen];
};

export default Sample;
