import React from "react";
import Buttons from "./common/Buttons.jsx";
import StepTitles from "./common/StepTitles.jsx";
import Validated from "./common/Validated.jsx";
import Slider from "@material-ui/core/Slider";
import { ComboBox, TextInput } from "carbon-components-react";

import "./../styles/batch.scss";

function validateStep1(payload) {
  const { _batch, productionLine } = payload;
  return !(productionLine && _batch);
}

function validateStep2(payload) {
  const { _tank, initialTemp, finalTemp, kneadingTime, pumpSpeed } = payload; 
  return !(_tank && kneadingTime && pumpSpeed);
}


const comboProps1 = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción...",
  titleText,
  // helperText: "Optional helper text here",
  light: true,
  size: "sm",
  direction: "bottom",
});

const screen = "cent";

const items = [
  { id: "1", text: "2", value: "2" },
  { id: "2", text: "2.5", value: "2.5" },
  { id: "3", text: "3", value: "3" },
];

const comboProps2 = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción",
  titleText,
  light: true,
  size: "sm",
});

const inputProps2 = (labelText) => ({
  id: labelText,
  size: "sm",
  labelText,
  light: true,
  type: "number",
});

const Cent = ({
  data,
  step,
  submit,
  onComboChange,
  onInputChange,
  onCheckChange,
  handleCentSlider,
}) => {

  if (!data) return "Cargando...";

  const { batches, prodLine } = data.init;

  const {
    _tank,
    pumpSpeed,
    initialTemp,
    finalTemp,
    kneadingTime,
    validated,
    productionLine
  } = data.payload;

  const { supervisor, init, payload } = data;
  const { tanks } = init;
  const tankIndex = _tank ? tanks.findIndex((i) => i.value === _tank) : 0;

  console.log("payload: ",payload);

  return (<>
    <div className="bx--grid bx--grid--full-width">
      <StepTitles
        title="Ingreso a centrifuga"
        helper="Selecciona el lote correspondiente"
        showSteps={false}
      />
      <div className="bx--row custom__row">
        <div className="bx--col">
          <ComboBox
            items={batches}
            itemToString={(item) => (item ? item.text : "")}
            onChange={(event) => onComboChange(event, "cent", "_batch")}
            {...comboProps1("Lote")}
          />
        </div>
      </div>
      <div className="bx--row custom__row">
        <div className="bx--col">
          <ComboBox
            items={prodLine}
            itemToString={(item) => (item ? item.text : "")}
            onChange={(event) =>
              onComboChange(event, "cent", "productionLine")
            }
            {...comboProps1("Linea de Producción")}
            selectedItem={
              prodLine[prodLine.findIndex((i) => i.text === productionLine)]
            }
          />
        </div>
      </div>

      { !validateStep1(payload) &&
        <>
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
                {...comboProps2("Tiempo de amasado (en hs)")}
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
                {...comboProps2("Tanque destino")}
                // selectedItem={tanks[tankIndex]}
              />
            </div>
          </div>
          <div className="bx--row custom__row">
            <div className="bx--col">
              <TextInput
                onChange={(event) =>
                  onInputChange(event, screen, "pumpSpeed", 6000)
                }
                {...inputProps2("Bombeo (kg/h)")}
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
        </>
      }
      
      <Buttons
        screen="cent"
        left="Cancelar"
        right={supervisor ? "Validar":"Ingresar"}
        onStep={step}
        disabled={validateStep2(payload)}
        onSubmit={submit}
      />
    </div>
  </>);
};

export default Cent;
