import React from "react";
import Batch1 from "./batch/Batch1";
import Batch2 from "./batch/Batch2";

const Batch = ({ data, step, submit, onComboChange, onInputChange }) => {
  const { step: screen } = data;
  const section = [
    <Batch1 step={step} data={data} onComboChange={onComboChange} />,
    <Batch2
      step={step}
      submit={submit}
      data={data}
      onComboChange={onComboChange}
      onInputChange={onInputChange}
    />,
  ];
  return section[screen];
};

export default Batch;
