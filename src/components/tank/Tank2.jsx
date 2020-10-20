import React, { Fragment } from "react";
import { ComboBox, TextInput } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";

const comboProps = (titleText) => ({
    id: titleText,
    placeholder: "Elegir una opción...",
    titleText,
    light: true,
    size: "sm",
    onToggleClick: () => console.log("onClick"),
  });

const inputProps = (labelText) => ({
    id: labelText,
    size: "sm",
    labelText,
    light: true,
    type: "number",
    onClick: () => console.log("onClick"),
});
  
  
export default function Tank2({step, submit, data, onComboChange, onInputChange, getPerformance}) {
    console.log("[DEBUG]")
    console.log(data)

    return (
        <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <div className="bx--row custom__row">
          <div className="bx--col ">Paso 2</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col"> Lote Fecha Hora</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col"> Lote Fecha Hora</div>
        </div>
      </div>
      <Buttons
        screen="tank"
        left="Anterior"
        right="Registrar"
        onStep={step}
        onSubmit={submit}
      />
    </Fragment>
    )
}
