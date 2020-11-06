import React from "react";
import { Checkbox } from "carbon-components-react";

const Validated = ({ mode, screen, validated, onCheckChange }) => {
  if (!mode) return "";
  console.log({ screen });
  return (
    <div className="bx--row custom__row">
      <div className="bx--col">
        <Checkbox
          id="validated"
          checked={validated}
          labelText="Validado"
          onChange={(event) => onCheckChange(event, screen, "validated")}
        />
      </div>
    </div>
  );
};

export default Validated;
