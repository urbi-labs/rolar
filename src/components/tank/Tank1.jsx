import React, { Fragment } from "react";
import { ComboBox } from "carbon-components-react";

// custom components
import Buttons from "../common/Buttons.jsx";
import StepTitles from "../common/StepTitles.jsx";

const screen = "tank";

const comboProps = (titleText) => ({
  id: titleText,
  titleText,
  light: true,
  size: "sm",
  placeholder: "Elegir una opción...",
  direction: "bottom",
});

export default function Tank1({ step, data, disabled, onComboChange }) {
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
                onComboChange(event, screen, "_tank");
              }}
              {...comboProps("Tanque")}
            />
          </div>
        </div>
      </div>
      <Buttons
        screen={screen}
        left="Anterior"
        right="Siguiente"
        onStep={step}
        disabled={disabled}
      />
    </Fragment>
  );
}
