import React, { Fragment } from "react";
import { ComboBox, TextInput, Toggle } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";
import "../../styles/sample.scss";

import paso2 from "../../images/paso2.png";
// Docs ComboBox: https://react.carbondesignsystem.com/?path=/story/combobox--default
// Docs TextInput: https://react.carbondesignsystem.com/?path=/story/textinput--default

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
  handleToggle,
  disabled,
}) => {
  console.log("rendering Sample2...");
  if (!data) return "Cargando...";

  //consultar
  const items = [
    { id: "1", text: " 1" },
    { id: "2", text: " 2" },
    { id: "3", text: " 3" },
    { id: "4", text: " 4" },
    { id: "5", text: " 5" },
    { id: "6", text: " 6" },
    { id: "7", text: " 7" },
  ];

  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width template__grid">
        <div className="bx--row custom__row">
          <div className="bx--col subtitle">Control de muestra</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col subtitle">
            <img src={paso2} alt="paso2"></img>
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col"> Fecha Hora </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "samples", "frost")}
              {...inputProps("Helada")}
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
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "samples", "mummified")}
              {...inputProps("Momificada")}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "samples", "dehydrated")
              }
              {...inputProps("Deshidratada")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "samples", "beaten")}
              {...inputProps("Golpeada")}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "samples", "waterExcess")
              }
              {...inputProps("Exceso de Agua")}
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
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "samples", "leafExcess")
              }
              {...inputProps("Exceso de Hojas")}
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
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "samples", "moisturePase")
              }
              {...inputProps("Humedad Pasta")}
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
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "samples", "rexPomace")}
              {...inputProps("Orujo Rex")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "samples", "wetFat")}
              {...inputProps("Materia Grasa TC/Humedo")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "samples", "dryFat")}
              {...inputProps("Materia Grasa TC/Seco")}
            />
          </div>
        </div>
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
