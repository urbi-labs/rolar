import React, { Fragment } from "react";
import { ComboBox, TextInput } from "carbon-components-react";

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
});

const inputProps = (labelText) => ({
  id: labelText,
  labelText,
  light: true,
  size: "sm",
  type: "number",
});

export default function Tank2({
  step,
  submit,
  data,
  onComboChange,
  onInputChange,
  getPerformance,
}) {
  console.log("[DEBUG]");
  console.log(data);

  const { batchArray } = data.payload;

  const calculateTotalLitres = () => {
    let totalLitres = 0;
    batchArray.map((e) => {
      totalLitres += e.totalLitres;
    });
    return Math.round(totalLitres * 100) / 100;
  };

  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <StepTitles title="Cierre de tanques" step="2" />

        {batchArray.map((e) => {
          let { _batch, timestamp } = e;
          const date = new Date(timestamp);
          _batch = _batch.substring(_batch.length - 5, _batch.length);
          const fullDate =
            date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
          const fullTime =
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
          return (
            <div className="bx--row custom__row">
              <div className="bx--col">{_batch}</div>
              <div className="bx--col">{fullDate}</div>
              <div className="bx--col">{fullTime}</div>
            </div>
          );
        })}
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              disabled={true}
              value={calculateTotalLitres() || 0}
              {...inputProps("Litros totales")}
            />
          </div>
        </div>
      </div>
      <Buttons
        screen={screen}
        left="Anterior"
        right="Registrar"
        onStep={step}
        onSubmit={submit}
      />
    </Fragment>
  );
}
