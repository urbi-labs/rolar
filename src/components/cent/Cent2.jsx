import React, { Fragment } from "react";
import Slider from "@material-ui/core/Slider";
import { ComboBox, TextInput } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";
import StepTitles from "../common/StepTitles.jsx";

import "../../styles/batch.scss";

const comboProps = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción",
  titleText,
  light: true,
  size: "sm",
});

const inputProps = (labelText) => ({
  id: labelText,
  size: "sm",
  labelText,
  light: true,
  type: "number",
});

const Cent2 = ({
  step,
  submit,
  data,
  onComboChange,
  onInputChange,
  handleCentSlider,
  disabled,
}) => {
  console.log("rendering Cent2...");
  if (!data) return "Cargando...";

  const valores = [data.payload.initialTemp, data.payload.finalTemp];

  const items = [
    { id: "1", text: "2", value: "2" },
    { id: "2", text: "2.5", value: "2.5" },
    { id: "3", text: "3", value: "3" },
  ];

  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <StepTitles title="Ingreso a centrifuga" step="2" />
        <div className="bx--row custom__row">
          <div className="bx--col">
            <span> Temperatura de Amasado (en C)</span>
            <Slider
              //ARREGLAR
              aria-labelledby="range-slider"
              value={valores}
              valueLabelDisplay="on"
              onChange={(event, value) => handleCentSlider(event, value)}
              min={20}
              max={40}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={items}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "cent", "kneadingTime")}
              {...comboProps("Tiempo de amasado (en hs)")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              //disabled={preset}
              //value={chuteWeight || 0}
              onChange={(event) => onInputChange(event, "cent", "pumpSpeed")}
              {...inputProps("Velocidad de bombeo")}
            />
          </div>
        </div>
        <Buttons
          screen="cent"
          left="Anterior"
          right="Registrar"
          onStep={step}
          disabled={disabled}
          onSubmit={submit}
        />
      </div>
    </Fragment>
  );
};

export default Cent2;
