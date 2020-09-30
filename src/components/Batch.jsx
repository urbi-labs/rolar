import React from "react";
import Batch1 from "./batch/Batch1";
import Batch2 from "./batch/Batch2";
import Batch3 from "./batch/Batch3";

const Batch = ({ data, step, submit, restart }) => {
  const { step: screen } = data;
  const section = [
    <Batch1 step={step} />,
    <Batch2 step={step} submit={submit} />,
    <Batch3 restart={restart} />,
  ];
  return section[screen];
};

export default Batch;
