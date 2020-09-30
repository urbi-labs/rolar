import React from "react";

const Batch3 = ({ restart }) => {
  console.log("Batch3");
  return <button onClick={() => restart("batch")}>Volver a inicio</button>;
};

export default Batch3;
