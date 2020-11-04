import React, { Fragment } from 'react'
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

export default function Tank1({ step, data, disabled, getStoragesFromTank, onComboChangeID }) {
    const { init: tanks } = data;
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
              items={tanks}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => {
                const { id: tank_id } = event.selectedItem;
                onComboChangeID(event, "tank", "_tank");
                getStoragesFromTank(tank_id)
              }}
              {...comboProps("Tanque")}
            />
          </div>
        </div>
      </div>

      <Buttons screen="tank" left="Anterior" right="Siguiente" onStep={step} disabled={disabled} />
    </Fragment>
    );
}
