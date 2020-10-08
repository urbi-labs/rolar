import React, { Fragment } from "react";
import { ComboBox } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";

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

export default function Sample1({ data, onComboChange, step }) {
  if (!data) return "Cargando...";
  const { init: batches } = data;
  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <div className="bx--row custom__row">
          <div className="bx--col ">Paso1</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col"> Selecciona el lote correspondiente</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={batches}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "sample", "_batch")}
              {...comboProps("Lote")}
            />
          </div>
        </div>
      </div>

      <Buttons screen="sample" left="Anterior" right="Siguiente" onStep={step} />
    </Fragment>
  );
}