import React, { Fragment } from "react";
import { ComboBox, TextInput, Toggle } from "carbon-components-react";
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
const inputProps = (labelText) => ({
  id: labelText,
  size: "sm",
  labelText,
  light: true,
  type: "number",
});

export default function Storage2({
  step,
  submit,
  data,
  onComboChange,
  onInputChange,
  getPerformance,
  handleToggle,
  disabled,
}) {
  console.log("[DEBUG]");
  console.log(data);

  let { initialMeasure, finalMeasure, coneValue, radius, cone } = data.payload;
  if (!cone) {
    coneValue = 0.5 * coneValue;
  }
  console.log(coneValue + " valor del cono " + cone);
  const totalLitres =
    coneValue +
    Math.PI *
      ((Math.pow(radius / 1000, 2) * (finalMeasure - initialMeasure)) / 1000) *
      1000;
  const updateTank = (event) => {
    console.log(event);
    if (event !== null && event.selectedItem !== null) {
      const { cone, _id, radius } = event.selectedItem;
      //TODO: Refactor code
      onInputChange({ target: { value: radius } }, "storage", "radius");
      onInputChange({ target: { value: cone } }, "storage", "coneValue");
      onComboChange({ selectedItem: { text: _id } }, "storage", "_tank");
    }
  };
  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <StepTitles title="Ingreso almacenamiento" step="2" />
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={data.init.tanks.data}
              itemToString={(item) => (!!item ? "Tank " + item.name : "")}
              onChange={(event) => updateTank(event)}
              {...comboProps("Tanque destino")}
            />
          </div>
          <Toggle
            aria-label="toggle button"
            defaultToggled={false}
            id="toggle-1"
            labelText="Se lleno el cono?"
            labelA={true}
            labelB={false}
            onToggle={(event) => handleToggle(event, "storage", "cone")}
          />
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "storage", "initialMeasure")
              }
              {...inputProps("Inicio regla nivel")}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "storage", "finalMeasure")
              }
              {...inputProps("Fin regla nivel")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              disabled
              value={finalMeasure - initialMeasure}
              {...inputProps("Total en cm")}
            />
          </div>
          <div className="bx--col">
            <TextInput
              disabled
              value={totalLitres}
              {...inputProps("Total en litros")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              disabled
              value={totalLitres * 0.92}
              {...inputProps("Kg aceite")}
            />
          </div>
          <div className="bx--col">
            <TextInput
              disabled
              value={getPerformance(totalLitres * 0.92)}
              {...inputProps("Rendimiento")}
            />
          </div>
        </div>
      </div>
      <Buttons
        screen="storage"
        left="Anterior"
        right="Registrar"
        onStep={step}
        onSubmit={submit}
        disabled={disabled}
      />
    </Fragment>
  );
}
