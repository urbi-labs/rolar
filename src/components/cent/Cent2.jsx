import React, { Fragment } from "react";
import Slider from "@material-ui/core/Slider";
import { ComboBox, TextInput } from "carbon-components-react";

// custom components
import Validated from "../common/Validated.jsx";
import Buttons from "../common/Buttons.jsx";
import StepTitles from "../common/StepTitles.jsx";

import "../../styles/batch.scss";

const screen = "cent";

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

  const {
    _tank,
    pumpSpeed,
    initialTemp,
    finalTemp,
    kneadingTime,
    validated,
  } = data.payload;

  const { supervisor, init } = data;
  const { tanks } = init;
  const tankIndex = _tank ? tanks.findIndex((i) => i.value === _tank) : 0;

  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <StepTitles title="Ingreso a centrifuga" step="2" />
        <div className="bx--row custom__row">
          <div className="bx--col">
            <span> Temperatura de Amasado (en C)</span>
            <Slider
              aria-labelledby="range-slider"
              value={[initialTemp || 20, finalTemp || 40]}
              valueLabelDisplay="auto"
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
              onChange={(event) => onComboChange(event, screen, "kneadingTime")}
              {...comboProps("Tiempo de amasado (en hs)")}
              selectedItem={
                items[items.findIndex((i) => i.text === kneadingTime + "")]
              }
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={tanks}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, screen, "_tank")}
              {...comboProps("Tanque destino")}
              selectedItem={tanks[tankIndex]}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, screen, "pumpSpeed", 6000)
              }
              {...inputProps("Bombeo (kg/h)")}
              value={pumpSpeed}
            />
          </div>
          <div className="bx--col">
            <Validated
              mode={supervisor}
              screen={screen}
              onCheckChange={onCheckChange}
              validated={validated}
            />
          </div>
        </div>

        <Buttons
          screen={screen}
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
