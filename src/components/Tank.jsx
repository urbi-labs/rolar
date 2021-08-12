import React, { useState, useEffect } from "react";
import { ComboBox } from "carbon-components-react";

// custom components
import Buttons from "./common/Buttons.jsx";
import StepTitles from "./common/StepTitles.jsx";

import { TextInput } from "carbon-components-react";

// custom components
import Validated from "./common/Validated.jsx";

// custom services and helper functions
import { getStoragesByTank } from "./../services/apiService";
import { calcTotalLitres } from "./../util/helpers";
import { fecha, hora } from "./../util/formats.js";


function validateStep1(payload) {
  const { _tank } = payload;
  return !_tank;
}


const screen = "tank";

const comboProps1 = (titleText) => ({
  id: titleText,
  titleText,
  light: true,
  size: "sm",
  placeholder: "Elegir una opción...",
  direction: "bottom",
});


const inputProps2 = (labelText) => ({
  id: labelText,
  labelText,
  light: true,
  size: "sm",
  type: "number",
});


const Tank = ({
  data,
  step,
  submit,
  onComboChange,
  onInputChange,
  onCheckChange,
}) => {
  const { step: screen, payload } = data;
  const { init: tanks } = data;
  const { _tank, validated } = data.payload;
  const { supervisor } = data;
  // const { batchArray } = data.payload;

  const [batchArray, setBatches] = useState([]);
  useEffect(() => {
    async function initBatches(_tank) {
      const { data } = await getStoragesByTank(_tank);
      setBatches(data);
      console.log(data);
    }
    initBatches(_tank);
  }, []);

  return (<>
    <div className="bx--grid bx--grid--full-width">
      <StepTitles
        title="Cierre de tanques"
        helper="Selecciona el tanque correspondiente"
        showSteps={false}
      />
      <div className="bx--row custom__row">
        <div className="bx--col">
          <ComboBox
            items={tanks}
            itemToString={(item) => (item ? item.text : "")}
            onChange={(event) => {
              onComboChange(event, screen, "_tank");
            }}
            {...comboProps1("Tanque")}
          />
        </div>
      </div>

      { !validateStep1(payload) &&
        <>
          <div className="bx--row custom__row">
            <div className="bx--col">Lote</div>
            <div className="bx--col">Fecha</div>
            <div className="bx--col">Hora</div>
          </div>
          {batchArray.map((batch, ind) => {
            const { _batch, timestamp } = batch;
            return (
              <div className="bx--row custom__row" key={ind}>
                <div className="bx--col time">{_batch.slice(-5)}</div>
                <div className="bx--col time">{fecha(timestamp)}</div>
                <div className="bx--col time">{hora(timestamp)}</div>
              </div>
            );
          })}
          <div className="bx--row custom__row">
            <div className="bx--col">
              <TextInput
                disabled={true}
                value={calcTotalLitres(batchArray)}
                {...inputProps2("Litros totales")}
              />
            </div>
          </div>
          <Validated
            mode={supervisor}
            screen={screen}
            onCheckChange={onCheckChange}
            validated={validated}
          />
        </>
      }
    </div>
    <Buttons
      screen={screen}
      left="Anterior"
      right="Siguiente"
      onStep={step}
      disabled={validateStep1(payload)}
    />
  </>);
};

export default Tank;
