import React from "react";
import { ComboBox, TextInput } from "carbon-components-react";
import Buttons from "./common/Buttons.jsx";
import StepTitles from "./common/StepTitles.jsx";
import Slider from "@material-ui/core/Slider";
import Validated from "./common/Validated.jsx";
import { sieves } from "./../config.json";
import "./../styles/batch.scss";
import "./../styles/mill.scss";

const comboProps1 = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción...",
  titleText,
  light: true,
  size: "sm",
  direction: "bottom",
});

function validateStep1(payload) {
  const { _batch, productionLine } = payload;
  return !(productionLine && _batch);
}

function validateStep2(payload) {
  const { sieve, microtalcum, enzymes } = payload;
  return !(sieve && microtalcum && enzymes);
}


const screen = "mill";

const comboProps2 = (titleText) => ({
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

const Mill = ({
  data,
  step,
  submit,
  onComboChange,
  onInputChange,
  onCheckChange,
  handleMillSlider,
  supervisor
}) => {
  if (!data) return "Cargando...";
  const { payload } = data;
  const { batches, prodLine } = data.init;
  const { productionLine, sieve, microtalcum, enzymes, validated } = payload;


  return (<>
     <div className="bx--grid bx--grid--full-width">
        <StepTitles
          title="Ingreso al molino"
          helper="Selecciona el lote correspondiente"
          showSteps={false}
        />
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={batches}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "mill", "_batch")}
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
                onComboChange(event, "mill", "productionLine")
              }
              {...comboProps1("Linea de Producción")}
              selectedItem={
                prodLine[prodLine.findIndex((i) => i.text === productionLine)]
              }
            />
          </div>
        </div>
      </div>

      { !validateStep1(payload) &&
              <><div className="bx--row custom__row">
                <div className="bx--col">
                  <ComboBox
                    items={sieves}
                    itemToString={(item) => (item ? item.text : "")}
                    onChange={(event) => onComboChange(event, screen, "sieve")}
                    {...comboProps2("Criba")}
                    selectedItem={sieve ? sieves[sieve - 1] : ""}
                  />
                </div>
                <div className="bx--col-sm-1">
                  <TextInput
                    value={microtalcum}
                    onChange={(event) => onInputChange(event, screen, "microtalcum", 1)}
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
              </div></>
      }

      <Buttons
        screen="mill"
        left="Cancelar"
        right={supervisor ? "Validar":"Registrar"}
        onStep={step}
        onSubmit={
          (e) => {
            // If button is disabled then show confirmation message before submitting
            if (validateStep2(payload)) {
              console.log('disabled')
            } else {
              submit(e)
            }
          }
        }
      />
  </>);
};

export default Mill;
