import React, { Fragment } from "react";
import Slider from "@material-ui/core/Slider";
import { ComboBox, TextInput, Checkbox } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";
import StepTitles from "../common/StepTitles.jsx";

import "../../styles/batch.scss";

const items = [
  { id: "1", text: "2", value: "2" },
  { id: "2", text: "2.5", value: "2.5" },
  { id: "3", text: "3", value: "3" },
];

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
  onCheckChange,
  handleCentSlider,
  disabled,
}) => {
  console.log("rendering Cent2...");
  if (!data) return "Cargando...";

  const { supervisor } = data;
  const {
    pumpSpeed,
    initialTemp,
    finalTemp,
    kneadingTime,
    validated,
  } = data.payload;

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
              value={[initialTemp, finalTemp]}
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
              selectedItem={
                items[items.findIndex((i) => i.text === kneadingTime + "")]
              }
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "cent", "pumpSpeed")}
              {...inputProps("Velocidad de bombeo")}
              value={pumpSpeed}
            />
          </div>
        </div>
        {supervisor && (
          <div className="bx--row custom__row">
            <div className="bx--col">
              <Checkbox
                id="validated"
                checked={validated}
                labelText="Validado"
                onChange={(event) => onCheckChange(event, "cent", "validated")}
              />
            </div>
          </div>
        )}
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