import React from "react";

const Batch2 = ({ step, submit }) => {
  console.log("rendering Batch2...");
  return (
    <div>
      <button onClick={() => step("batch", false)}>Anterior</button>
      <button onClick={() => submit("batch")}>Registrar</button>
    </div>
  );
};

export default Batch2;
