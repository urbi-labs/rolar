import React, { Fragment } from "react";
import { ComboBox } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";
import StepTitles from "../common/StepTitles.jsx";
import "../../styles/batch.scss";

const comboProps = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción...",
  titleText,
  // helperText: "Optional helper text here",
  light: true,
  size: "sm",
  direction: "bottom",
});

const Cent1 = ({ step, data, onComboChange, disabled }) => {
  console.log("rendering Cent1...");
  if (!data) return "Cargando...";

  const { batches, prodLine } = data.init;
  const { productionLine } = data.payload;
  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <StepTitles
          title="Ingreso a centrifuga"
          helper="Selecciona el lote correspondiente"
        />
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={batches}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "cent", "_batch")}
              {...comboProps("Lote")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={prodLine}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) =>
                onComboChange(event, "cent", "productionLine")
              }
              {...comboProps("Linea de Producción")}
              selectedItem={
                prodLine[prodLine.findIndex((i) => i.text === productionLine)]
              }
            />
          </div>
        </div>
      </div>

      <Buttons
        screen="cent"
        left="Anterior"
        right="Siguiente"
        onStep={step}
        disabled={disabled}
      />
    </Fragment>
  );
};

export default Cent1;
