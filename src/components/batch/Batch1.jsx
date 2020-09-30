import React from "react";

const Batch1 = ({ step }) => {
  console.log("rendering Batch1...");
  return (
    <div>
      <button onClick={() => step("batch", false)}>Anterior</button>
      <button onClick={() => step("batch")}>Siguiente</button>
    </div>
  );
};

export default Batch1;
