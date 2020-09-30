import React from "react";

const Feedback = ({ label, serial, restart }) => {
  console.log("Feedback llaalalala");
  return (
    <div>
      <div>label:{label}</div> <br />
      <div>nro:{serial}</div> <br />
      <button onClick={() => restart("batch")}>Volver a inicio</button>
    </div>
  );
};

export default Feedback;
