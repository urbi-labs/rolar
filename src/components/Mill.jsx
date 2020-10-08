import React from "react";
import Mill1 from "./mill/Mill1";
import Mill2 from "./mill/Mill2";

const Mill = ({ data, step, submit, onComboChange, onInputChange }) => {
  const { step: screen } = data;
  const section = [
    <Mill1 data={data} onComboChange={onComboChange} step={step} />,
    <Mill2 />,
  ];
  return section[screen];
};

export default Mill;
