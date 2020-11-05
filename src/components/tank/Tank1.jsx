import React, { Fragment } from "react";
import { ComboBox } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";
import StepTitles from "../common/StepTitles.jsx";

const comboProps = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción...",
  titleText,
  light: true,
  size: "sm",
  direction: "bottom",
});

export default function Tank1({
  step,
  data,
  disabled,
  getStoragesFromTank,
  onComboChangeID,
}) {
  const { init: tanks } = data;
  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <StepTitles
          title="Cierre de tanques"
          helper="Selecciona el tanque correspondiente"
        />
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={tanks}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => {
                const { id: tank_id } = event.selectedItem;
                onComboChangeID(event, "tank", "_tank");
                getStoragesFromTank(tank_id);
              }}
              {...comboProps("Tanque")}
            />
          </div>
        </div>
      </div>

      <Buttons
        screen="tank"
        left="Anterior"
        right="Siguiente"
        onStep={step}
        disabled={disabled}
      />
    </Fragment>
  );
}
