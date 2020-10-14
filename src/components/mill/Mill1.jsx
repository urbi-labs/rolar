import React, { Fragment } from "react";
import { ComboBox } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";
import "../../styles/batch.scss";

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

const Mill1 = ({ step, data, onComboChange }) => {
  console.log("rendering Mill1...");
  if (!data) return "Cargando...";
  console.log(data);
  const { batches, prodLine } = data.init;
  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <div className="bx--row custom__row">
          <div className="bx--col ">Paso 1</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col"> Selecciona el lote correspondiente</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={batches}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "mill", "batches")}
              {...comboProps("Lote")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={prodLine}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "mill", "prodLine")}
              {...comboProps("Linea de Producción")}
            />
          </div>
        </div>
      </div>

      <Buttons screen="mill" left="Anterior" right="Siguiente" onStep={step} />
    </Fragment>
  );
};

export default Mill1;
