import React, { Fragment } from "react";
import Slider from "@material-ui/core/Slider";
import { ComboBox, TextInput, Checkbox } from "carbon-components-react";
import StepTitles from "../common/StepTitles.jsx";
import Buttons from "../common/Buttons.jsx";
import "../../styles/mill.scss";

const items = [
  { id: "1", text: "Criba 1", value: "1" },
  { id: "2", text: "Criba 2", value: "2" },
];

const comboProps = (titleText, helperText) => ({
  id: titleText,
  placeholder: "Cribas",
  helperText,
  titleText,
  light: true,
  size: "sm",
});

const inputProps = (labelText, helperText) => ({
  id: labelText,
  size: "sm",
  labelText,
  helperText,
  light: true,
  type: "number",
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
              items={items}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "mill", "sieve")}
              {...comboProps("Criba", "Elegir nro de criba.")}
              selectedItem={sieve ? items[sieve - 1] : ""}
            />
          </div>
          <div className="bx--col">
            <TextInput
              value={microtalcum}
              onChange={(event) => onInputChange(event, "mill", "microtalcum")}
              {...inputProps("Microtalco", "Valor entre cero y uno.")}
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
              valueLabelDisplay="on"
              step={50}
              min={0}
              max={500}
              onChange={(event, value) =>
                handleMillSlider(event, value, "mill", "enzymes")
              }
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
                onChange={(event) => onCheckChange(event, "mill", "validated")}
              />
            </div>
          </div>
        )}
        <Buttons
          screen="mill"
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
