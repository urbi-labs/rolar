import React, { Fragment } from "react";
import Slider from "@material-ui/core/Slider";
import { ComboBox, TextInput } from "carbon-components-react";

// custom components
import Validated from "../common/Validated.jsx";
import StepTitles from "../common/StepTitles.jsx";
import Buttons from "../common/Buttons.jsx";

import { sieves } from "../../config.json";

import "../../styles/mill.scss";

const screen = "mill";

const comboProps = (titleText) => ({
  id: titleText,
  placeholder: "Cribas",
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
  step: 1,
  min: 0,
  max: 10,
});

const Mill2 = ({
  step,
  submit,
  data,
  onComboChange,
  onInputChange,
  onCheckChange,
  handleMillSlider,
  disabled,
}) => {
  console.log("rendering Mill2...");
  if (!data) return "Cargando...";

  const { supervisor } = data;
  const { sieve, microtalcum, enzymes, validated } = data.payload;

  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <StepTitles title="Ingreso al molino" step="2" />
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={sieves}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, screen, "sieve")}
              {...comboProps("Criba")}
              selectedItem={sieve ? sieves[sieve - 1] : ""}
            />
          </div>
          <div className="bx--col-sm-1">
            <TextInput
              value={microtalcum}
              onChange={(event) => onInputChange(event, screen, "microtalcum",1)}
              {...inputProps("Microtalco (kg/ton)")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <div className="mill--slider"></div>
            <span>Enzimas</span>
            <Slider
              defaultValue={enzymes}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={50}
              min={0}
              max={500}
              onChange={(event, value) =>
                handleMillSlider(event, value, screen, "enzymes")
              }
            />
          </div>
          <Validated
            mode={supervisor}
            screen={screen}
            onCheckChange={onCheckChange}
            validated={validated}
          />
        </div>
        <Buttons
          screen={screen}
          left="Anterior"
          right="Registrar"
          onStep={step}
          onSubmit={submit}
          disabled={disabled}
        />
      </div>
    </Fragment>
  );
};

export default Mill2;
