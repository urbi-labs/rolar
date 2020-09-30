import React from "react";
import Batch1 from "./batch/Batch1";
import Batch2 from "./batch/Batch2";

const Batch = ({ data, step, submit }) => {
  const { step: screen } = data;
  const section = [
    <Batch1 step={step} />,
    <Batch2 step={step} submit={submit} />,
  ];
  return section[screen];
};

export default Batch;
