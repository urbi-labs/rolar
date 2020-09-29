import React from "react";
import Batch1 from "../batch/Batch1";

const Batch = ({ data }) => {
  const { payload, step } = data;
  const section = [<Batch1 />, <div>step2</div>, <div>step3</div>];
  return section[step];
};

export default Batch;
