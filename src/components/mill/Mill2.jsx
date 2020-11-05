import React, { Fragment } from "react";
import Slider from "@material-ui/core/Slider";
import { ComboBox, TextInput } from "carbon-components-react";
import StepTitles from "../common/StepTitles.jsx";
import Buttons from "../common/Buttons.jsx";
import "../../styles/batch.scss";

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
});

const Mill2 = ({
  step,
  submit,
  data,
  onComboChange,
  onInputChange,
  handleMillSlider,
  disabled,
}) => {
  console.log("rendering Mill2...");

  if (!data) return "Cargando...";

  const items = [
    { id: "1", text: "Criba 1", value: "1" },
    { id: "2", text: "Criba 2", value: "2" },
  ];

  const { sieve, microtalcum, enzymes } = data.payload;

  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <StepTitles tile="Ingreso al molino" />
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={items}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "mill", "sieve")}
              {...comboProps("Nro. Criba")}
              selectedItem={sieve ? items[sieve - 1] : ""}
            />
          </div>
          <div className="bx--col">
            <TextInput
              //disabled={preset}
              value={microtalcum}
              onChange={(event) => onInputChange(event, "mill", "microtalcum")}
              {...inputProps("Microtalco")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
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
