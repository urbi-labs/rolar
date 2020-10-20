import React, { Fragment } from "react";
import { ComboBox, TextInput, Toggle } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";
import "../../styles/batch.scss";

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



const Sample2 = ({ step, submit, data, onComboChange, onInputChange, handleToggle }) => {
  console.log("rendering Sample2...");
  if (!data) return "Cargando...";
  
  //consultar
  const items = [
    { "id": "1", "text": " 1" },
    { "id": "2", "text": " 2" },
    { "id": "3", "text": " 3" },
    { "id": "4", "text": " 4" },
    { "id": "5", "text": " 5" },
    { "id": "6", "text": " 6" },
    { "id": "7", "text": " 7" }]

  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <div className="bx--row custom__row">
          <div className="bx--col ">Paso1</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col"> Fecha Hora </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
              <TextInput
                onChange={(event) => onInputChange(event, "sample", "frost")}
                {...inputProps("Helada")}
              />
          </div>
          <div className="bx--col">
            <Toggle
                aria-label="toggle button"
                defaultToggled= {false}
                id="toggle-1"
                labelText="Aceite Hidráulico"
                labelA= {true}
                labelB= {false}
                onChange={(event) => handleToggle(event,"sample","hidraulicOil")}s
                />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "sample", "mummified")}
              {...inputProps("Momificada")}
            />
          </div>
          <div className="bx--col">
            <TextInput
               onChange={(event) => onInputChange(event, "sample", "dehydrated")}
              {...inputProps("Deshidratada")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "sample", "beaten")
              }
              {...inputProps("Golpeada")}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "sample", "waterExcess")
              }
              {...inputProps("Exceso de Agua")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "sample", "mummified")}
              {...inputProps("Momificada")}
            />
          </div>
          <div className="bx--col">
            <TextInput
               onChange={(event) => onInputChange(event, "sample", "dehydrated")}
              {...inputProps("Deshidratada")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "sample", "branchExcess")
              }
              {...inputProps("Exceso de ramas")}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "sample", "leafExcess")
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
                onChange={(event) => onComboChange(event, "sample", "maturityIndex")}
                {...comboProps("Indice de Madurez")}
              />
          </div>
          <div className="bx--col">
            <TextInput
               onChange={(event) => onInputChange(event, "sample", "moisturePase")}
              {...inputProps("Humedad Pasta")}
            />
          </div>
          </div>
          <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "sample", "taurusPomace")
              }
              {...inputProps("Orujo Taurus")}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "sample", "rexPomace")
              }
              {...inputProps("Orujo Rex")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
        <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "sample", "wetFat")
              }
              {...inputProps("Materia Grasa TC/Humedo")}
            />
          </div>
          </div>
          <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "sample", "dryFat")
              }
              {...inputProps("Materia Grasa TC/Seco")}
            />
          </div>
          </div>
      </div>
      <Buttons
        screen="sample"
        left="Anterior"
        right="Registrar"
        onStep={step}
        onSubmit={submit}
      />
    </Fragment>
  );
};

export default Sample2;
