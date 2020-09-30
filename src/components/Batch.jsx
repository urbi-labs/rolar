import React from "react";
import Batch1 from "./batch/Batch1";
import Batch2 from "./batch/Batch2";
import Batch3 from "./batch/Batch3";

const Batch = ({ data, step, submit }) => {
  console.log("rendering Batch...");
  const { step: screen } = data;
  console.log({ screen });
  const section = [
    <Batch1 step={step} />,
    <Batch2 step={step} />,
    <Batch3 submit={submit} />,
  ];
  return section[screen];
};

export default Batch;
