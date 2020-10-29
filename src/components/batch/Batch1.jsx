import React, { Fragment } from "react";
import { ComboBox } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";
import "../../styles/batch.scss";

import paso1 from "../../images/paso1.png";

// Docs ComboBox
// https://react.carbondesignsystem.com/?path=/story/combobox--default

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

const Batch1 = ({ step, data, onComboChange }) => {
  console.log("rendering Batch1...");
  if (!data) return "Cargando...";
  console.log(data);
  const { clients, parcels, oliveTypes } = data.init;
  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <div className="bx--row custom__row">
          <div className="bx--col subtitle">Ingresar nuevo lote</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col subtitle">
            <img src={paso1} alt="paso1"></img>
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col"> Fecha Hora Cliente</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={clients}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "batch", "client")}
              {...comboProps("Cliente")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={parcels}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "batch", "parcel")}
              {...comboProps("Cuadro")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={oliveTypes}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "batch", "oliveType")}
              {...comboProps("Variedad")}
            />
          </div>
        </div>
      </div>

      <Buttons screen="batch" left="Anterior" right="Siguiente" onStep={step} />
    </Fragment>
  );
};

export default Batch1;
