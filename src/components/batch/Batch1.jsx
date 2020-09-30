import React from "react";
import { Button } from "carbon-components-react";

const Batch1 = ({ step }) => {
  console.log("rendering Batch1...");
  return (
    <div>
      Paso1 <br />
      <Button kind="tertiary" size="small" onClick={() => step("batch", false)}>
        Anterior
      </Button>
      <Button kind="tertiary" size="small" onClick={() => step("batch")}>
        Siguiente
      </Button>
    </div>
  );
};

export default Batch1;
