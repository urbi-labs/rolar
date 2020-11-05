import React, { Fragment } from "react";
import { ComboBox, TextInput, Toggle, Checkbox } from "carbon-components-react";
import StepTitles from "../common/StepTitles.jsx";
import Buttons from "../common/Buttons.jsx";
import "../../styles/sample.scss";

// Docs ComboBox: https://react.carbondesignsystem.com/?path=/story/combobox--default
// Docs TextInput: https://react.carbondesignsystem.com/?path=/story/textinput--default

//consultar
const items = [
  { id: "1", text: "1", value: "1" },
  { id: "2", text: "2", value: "2" },
  { id: "3", text: "3", value: "3" },
  { id: "4", text: "4", value: "4" },
  { id: "5", text: "5", value: "5" },
  { id: "6", text: "6", value: "6" },
  { id: "7", text: "7", value: "7" },
];

const comboProps = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción...",
  titleText,
  light: true,
  size: "sm",
  onToggleClick: () => console.log("onClick"),
});

const inputProps = (labelText) => ({
  id: labelText,
  size: "sm",
  labelText,
  light: true,
  type: "number",
  onClick: () => console.log("onClick"),
});

const Sample2 = ({
  step,
  submit,
  data,
  onComboChange,
  onInputChange,
  onCheckChange,
  handleToggle,
  disabled,
}) => {
  console.log("rendering Sample2...");
  if (!data) return "Cargando...";

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

  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width template__grid">
        <StepTitles tile="Control de muestra" step="2" />

        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "samples", "frost")}
              {...inputProps("Helada")}
              value={frost}
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
              onToggle={(event) =>
                handleToggle(event, "samples", "hidraulicOil")
              }
              toggled={hidraulicOil}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "samples", "mummified")}
              {...inputProps("Momificada")}
              value={mummified}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "samples", "dehydrated")
              }
              {...inputProps("Deshidratada")}
              value={dehydrated}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "samples", "beaten")}
              {...inputProps("Golpeada")}
              value={beaten}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "samples", "waterExcess")
              }
              {...inputProps("Exceso de Agua")}
              value={waterExcess}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "samples", "branchExcess")
              }
              {...inputProps("Exceso de ramas")}
              value={branchExcess}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "samples", "leafExcess")
              }
              {...inputProps("Exceso de Hojas")}
              value={leafExcess}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={items}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) =>
                onComboChange(event, "samples", "maturityIndex")
              }
              {...comboProps("Indice de Madurez")}
              selectedItem={items[maturityIndex - 1]}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "samples", "moisturePase")
              }
              {...inputProps("Humedad Pasta")}
              value={moisturePase}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "samples", "taurusPomace")
              }
              {...inputProps("Orujo Taurus")}
              value={taurusPomace}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "samples", "rexPomace")}
              {...inputProps("Orujo Rex")}
              value={rexPomace}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "samples", "wetFat")}
              {...inputProps("Materia Grasa TC/Humedo")}
              value={wetFat}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "samples", "dryFat")}
              {...inputProps("Materia Grasa TC/Seco")}
              value={dryFat}
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
                onChange={(event) =>
                  onCheckChange(event, "samples", "validated")
                }
              />
            </div>
          </div>
        )}
      </div>
      <Buttons
        screen="samples"
        left="Anterior"
        right="Registrar"
        onStep={step}
        onSubmit={submit}
        disabled={disabled}
      />
    </Fragment>
  );
};

export default Sample2;
