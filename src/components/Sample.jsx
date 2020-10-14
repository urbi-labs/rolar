import React from "react";
import Sample1 from "./sample/Sample1";
import Sample2 from "./sample/Sample2";

const Sample = ({ data, step, submit, onComboChange, onInputChange, handleToggle }) => {
  const { step: screen } = data;
  const section = [
    <Sample1 step={step} data={data} onComboChange={onComboChange} />,
    <Sample2
      step={step}
      submit={submit}
      data={data}
      onComboChange={onComboChange}
      onInputChange={onInputChange}
      handleToggle={handleToggle}
    />,
  ];
  return section[screen];
};

export default Sample;
