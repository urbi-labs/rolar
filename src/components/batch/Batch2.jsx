import React from "react";

const Batch2 = ({ step }) => {
  console.log("rendering Batch2...");
  return (
    <div>
      <button onClick={() => step("batch", false)}>Anterior</button>
      <button onClick={() => step("batch")}>Registrar</button>
    </div>
  );
};

export default Batch2;
