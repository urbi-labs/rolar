import React, { Fragment } from "react";
import { ComboBox } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";
import "../../styles/batch.scss";

// Docs ComboBox
// https://react.carbondesignsystem.com/?path=/story/combobox--default

const items = [
  {
    id: "rolar",
    text: "Rolar",
  },
];

const props = (titleText) => ({
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
  onChange: () => console.log("onChange"),
  onToggleClick: () => console.log("onClick"),
});

const Batch1 = ({ step }) => {
  console.log("rendering Batch1...");
  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <div className="bx--row custom__row">
          <div className="bx--col ">Paso1</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col"> Fecha Hora Cliente</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={items}
              itemToString={(item) => (item ? item.text : "")}
              {...props("Cliente")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={items}
              itemToString={(item) => (item ? item.text : "")}
              {...props("Cuadro")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={items}
              itemToString={(item) => (item ? item.text : "")}
              {...props("Variedad")}
            />
          </div>
        </div>
      </div>

      <Buttons screen="batch" left="Anterior" right="Siguiente" onStep={step} />
    </Fragment>
  );
};

export default Batch1;
