import React, { Fragment } from "react";
import { ComboBox } from "carbon-components-react";
import StepTitles from "../common/StepTitles";
import Buttons from "../common/Buttons.jsx";

import "../../styles/sample.scss";

const comboProps = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción...",
  titleText,
  // helperText: "Optional helper text here",
  light: true,
  disabled: false,
  invalid: false,
  invalidText: "A valid value is required",
  size: "sm",
  direction: "bottom",
  onToggleClick: () => console.log("onClick"),
});

export default function Sample1({ data, onComboChange, step, disabled }) {
  if (!data) return "Cargando...";
  const { init: batches } = data;

  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <StepTitles
          title="Control de muestra"
          helper="Selecciona el lote correspondiente"
        />
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={batches}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "samples", "_batch")}
              {...comboProps("Lote")}
            />
          </div>
        </div>
      </div>

      <Buttons
        screen="samples"
        left="Anterior"
        right="Siguiente"
        onStep={step}
        disabled={disabled}
      />
    </Fragment>
  );
}
