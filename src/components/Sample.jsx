import React from "react";
import { ComboBox } from "carbon-components-react";
import StepTitles from "./common/StepTitles";
import Buttons from "./common/Buttons.jsx";
import { TextInput, Toggle } from "carbon-components-react";
import Validated from "./common/Validated.jsx";

// custom components

import "./../styles/sample.scss";

// Docs ComboBox: https://react.carbondesignsystem.com/?path=/story/combobox--default
// Docs TextInput: https://react.carbondesignsystem.com/?path=/story/textinput--default


function validateStep1(payload) {
  const { _batch } = payload;
  return !_batch;
}

function validateStep2(payload) {
  const {
    frost,
    mummified,
    dehydrated,
    beaten,
    waterExcess,
    branchExcess,
    leafExcess,
    maturityIndex,
    moisturePase,
    wetFat,
    dryFat,
    taurusPomace,
    rexPomace,
  } = payload;
  return !(
    frost &&
    mummified &&
    dehydrated &&
    beaten &&
    waterExcess &&
    branchExcess &&
    leafExcess &&
    maturityIndex &&
    moisturePase &&
    wetFat &&
    dryFat &&
    taurusPomace &&
    rexPomace
  );
}

const comboProps1 = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción...",
  titleText,
  // helperText: "Optional helper text here",
  light: true,
  disabled: false,
  invalid: false,
  invalidText: "A valid value is required",
  size: "sm",
  direction: "bottom",
  onToggleClick: () => console.log("onClick"),
});


const Sample = ({
  data,
  step,
  submit,
  onComboChange,
  onInputChange,
  onCheckChange,
  handleToggle,
}) => {
  const { payload } = data;
  // const section = [
  //   <Sample1
  //     step={step}
  //     data={data}
  //     onComboChange={onComboChange}
  //     disabled={validateStep1(payload)}
  //   />,
  //   <Sample2
  //     step={step}
  //     submit={submit}
  //     data={data}
  //     onComboChange={onComboChange}
  //     onInputChange={onInputChange}
  //     onCheckChange={onCheckChange}
  //     handleToggle={handleToggle}
  //     disabled={validateStep2(payload)}
  //   />,
  // ];
  if (!data) return "Cargando...";
  const { init: batches } = data;
  const {
    frost,
    hidraulicOil,
    mummified,
    dehydrated,
    beaten,
    waterExcess,
    branchExcess,
    leafExcess,
    maturityIndex,
    moisturePase,
    wetFat,
    dryFat,
    taurusPomace,
    rexPomace,
    validated,
  } = data.payload;

  const { supervisor } = data;


  const inputProps2 = (labelText) => ({
    id: labelText,
    size: "sm",
    labelText,
    light: true,
    type: "number",
    min: 0,
    step: 1,
    onKeyPress: (event) => console.log(event.target.value),
  });

  return (
    <>
      <div className="bx--grid--full-width">
        <StepTitles
          title="Control de muestra"
          showSteps={false}
          helper="Selecciona el lote correspondiente"
        />
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={batches}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "samples", "_batch")}
              {...comboProps1("Lote")}
            />
          </div>
        </div>
      </div>

      {!validateStep1(payload) &&
        <>
          <div className="bx--row custom__row">
            <div className="bx--col">
              <TextInput
                onChange={(event) => onInputChange(event, "samples", "frost", 100)}
                {...inputProps2("Helada (%)")}
                value={frost < 101 ? frost : frost}
              />
            </div>
            <div className="bx--col">
              <Toggle
                aria-label="toggle button"
                defaultToggled={false}
                id="toggle-1"
                labelText="Aceite Hidráulico"
                labelA={"No"}
                labelB={"Sí"}
                onToggle={(event) => handleToggle(event, "samples", "hidraulicOil")}
                toggled={hidraulicOil}
              />
            </div>
          </div>
          <div className="bx--row custom__row">
            <div className="bx--col">
              <TextInput
                onChange={(event) => onInputChange(event, "samples", "mummified", 100)}
                {...inputProps2("Momificada (%)")}
                value={mummified}
              />
            </div>
            <div className="bx--col">
              <TextInput
                onChange={(event) => onInputChange(event, "samples", "dehydrated", 100)}
                {...inputProps2("Deshidratada (%)")}
                value={dehydrated}
              />
            </div>
          </div>
          <div className="bx--row custom__row">
            <div className="bx--col">
              <TextInput
                onChange={(event) => onInputChange(event, "samples", "beaten", 100)}
                {...inputProps2("Golpeada (%)")}
                value={beaten}
              />
            </div>
            <div className="bx--col">
              <TextInput
                onChange={(event) => onInputChange(event, "samples", "waterExcess", 100)}
                {...inputProps2("Exceso de Agua (%)")}
                value={waterExcess}
              />
            </div>
          </div>
          <div className="bx--row custom__row">
            <div className="bx--col">
              <TextInput
                onChange={(event) => onInputChange(event, "samples", "branchExcess", 100)}
                {...inputProps2("Exceso de ramas (%)")}
                value={branchExcess}
              />
            </div>
            <div className="bx--col">
              <TextInput
                onChange={(event) => onInputChange(event, "samples", "leafExcess", 100)}
                {...inputProps2("Exceso de Hojas (%)")}
                value={leafExcess}
              />
            </div>
          </div>
          <div className="bx--row custom__row">
            <div className="bx--col">
              {/* <ComboBox
               items={items}
               itemToString={(item) => (item ? item.text : "")}
               onChange={(event) =>
                 onComboChange(event, "samples", "maturityIndex")
               }
               {...comboProps("Indice de Madurez")}
               selectedItem={items[maturityIndex - 1]}
             /> */}
              <TextInput
                onChange={(event) =>
                  onInputChange(event, "samples", "maturityIndex", 7)
                }
                {...inputProps2("Indice de Madurez")}
                value={maturityIndex}
              />
            </div>
            <div className="bx--col">
              <TextInput
                onChange={(event) => onInputChange(event, "samples", "moisturePase", 100)}
                {...inputProps2("Humedad Pasta (%)")}
                value={moisturePase}
              />
            </div>
          </div>
          <div className="bx--row custom__row">
            <div className="bx--col">
              <TextInput
                onChange={(event) => onInputChange(event, "samples", "taurusPomace", 100)}
                {...inputProps2("Orujo Taurus (%)")}
                value={taurusPomace}
              />
            </div>
            <div className="bx--col">
              <TextInput
                onChange={(event) => onInputChange(event, "samples", "rexPomace", 100)}
                {...inputProps2("Orujo Rex (%)")}
                value={rexPomace}
              />
            </div>
          </div>
          <div className="bx--row custom__row">
            <div className="bx--col">
              <TextInput
                onChange={(event) => onInputChange(event, "samples", "wetFat", 100)}
                {...inputProps2("Materia Grasa TC/Humedo (%)")}
                value={wetFat}
              />
            </div>
          </div>
          <div className="bx--row custom__row">
            <div className="bx--col">
              <TextInput
                onChange={(event) => onInputChange(event, "samples", "dryFat", 100)}
                {...inputProps2("Materia Grasa TC/Seco (%)")}
                value={dryFat}
              />
            </div>
          </div>
          <Validated
            mode={supervisor}
            screen={"samples"}
            onCheckChange={onCheckChange}
            validated={validated}
          />
        </>
      }

      <Buttons
        screen="samples"
        left="Anterior"
        right={supervisor ? "Validar" : "Ingresar"}
        onSubmit={submit}
        onStep={step}
        disabled={validateStep2(payload)}
      />
    </>
  );
};

export default Sample;
