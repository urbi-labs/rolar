import React from "react";
import Cent1 from "./cent/Cent1";
import Cent2 from "./cent/Cent2";

const Cent = ({ data, step, submit, onComboChange, onInputChange, handleCentSlider }) => {
  const { step: screen } = data;
  const section = [
    <Cent1 data={data} onComboChange={onComboChange} step={step} />,
    <Cent2
      step={step}
      submit={submit}
      data={data}
      onComboChange={onComboChange}
      onInputChange={onInputChange}
      handleCentSlider= {handleCentSlider}
    />,
  ];
  return section[screen];
};

export default Cent;

