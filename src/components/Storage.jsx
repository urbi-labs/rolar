import React from "react";
import Storage1 from "./storage/Storage1";
import Storage2 from "./storage/Storage2";

const Storage = ({ data, step, submit, onComboChange, onInputChange, onComboChangeID, getPerformance }) => {
  const { step: screen } = data;
  const section = [
    <Storage1 data={data} onComboChange={onComboChange} step={step} />,
    <Storage2 onComboChange={onComboChange} step={step} submit={submit} onComboChangeID={onComboChangeID} data={data} onInputChange={onInputChange} getPerformance={getPerformance} />,
  ];
  return section[screen];
};

export default Storage;
