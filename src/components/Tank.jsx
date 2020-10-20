import React from "react";
import Tank1 from "./tank/Tank1";
import Tank2 from "./tank/Tank2";

const Tank = ({ data, step, submit, onComboChange, onInputChange, onComboChangeID, getStoragesFromTank }) => {
  const { step: screen } = data;
  const section = [
    <Tank1 data={data} onComboChange={onComboChange} step={step} onComboChangeID={onComboChangeID} getStoragesFromTank={getStoragesFromTank} />,
    <Tank2 submit={submit} onComboChange={onComboChange} data={data} onInputChange={onInputChange} onComboChangeID={onComboChangeID} step={step} />,
  ];
  return section[screen];
};

export default Tank;
