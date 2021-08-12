import React, { useState, useEffect } from "react";
import Buttons from "./common/Buttons.jsx";
import StepTitles from "./common/StepTitles.jsx";
import { ComboBox, TextInput, Toggle } from "carbon-components-react";
import Validated from "./common/Validated.jsx";

// services and utility functions
import { calcs } from "./../util/helpers";
import { getBatchById } from "./../services/apiService";

function validateStep1(payload) {
  const { _batch } = payload;
  return !!!_batch;
}

function validateStep2(payload) {
  const { _tank, initialMeasure, finalMeasure } = payload;
  return !(_tank && initialMeasure && finalMeasure);
}

const screen = "storage";

const comboProps1 = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción...",
  titleText,
  light: true,
  size: "sm",
  direction: "bottom",
});


const comboProps2 = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción...",
  titleText,
  light: true,
  size: "sm",
  direction: "bottom",
});
const inputProps2 = (labelText) => ({
  id: labelText,
  size: "sm",
  labelText,
  light: true,
  type: "number",
});

const Storage = async ({
  data,
  step,
  submit,
  onComboChange,
  onInputChange,
  handleToggle,
  onCheckChange,
}) => {
  const { payload, supervisor } = data;

  const { batches, tanks } = data.init;

  const {
    _tank,
    _batch,
    initialMeasure,
    finalMeasure,
    totalCm,
    totalLitres,
    cone,
    validated,
  } = data.payload;

  const tankIndex = _tank ? tanks.findIndex((i) => i.value === _tank) : 0;

  const [batch, setBatch] = useState({});
  useEffect(() => {
    async function initBatch(id) {
      const batch_obj = await getBatchById(id);
      console.log("batch_obj  ",batch_obj);
      // const { data } = batch_obj;
      // setBatch(data);
    }
    // initBatch(_batch);
  }, []);

  const { tot_cm, tot_lt, oilWeight, perf } = calcs(
    initialMeasure,
    finalMeasure,
    cone,
    tanks[tankIndex],
    batch.netWeight
  );

  return (<>
    <div className="bx--grid bx--grid--full-width">
      <StepTitles
        title="Ingreso almacenamiento"
        helper="Selecciona el lote correspondiente"
      />
      <div className="bx--row custom__row">
        <div className="bx--col">
          <ComboBox
            items={batches}
            itemToString={(item) => (item ? item.text : "")}
            onChange={(event) => onComboChange(event, screen, "_batch")}
            {...comboProps1("Lote")}
          />
        </div>
      </div>

      { !validateStep1(payload) &&
        <>
          <div className="bx--row custom__row">
            <div className="bx--col-sm-3">
              <ComboBox
                items={tanks}
                itemToString={(item) => (item ? item.text : "")}
                onChange={(event) => onComboChange(event, screen, "_tank")}
                {...comboProps2("Tanque")}
                selectedItem={tanks[tankIndex]}
              />
            </div>
            <div className="bx--col-sm-1">
              <Toggle
                toggled={cone}
                id="cone-toggle"
                aria-label="cono"
                labelText="¿Cono lleno?"
                labelA={"No"}
                labelB={"Sí"}
                onToggle={(event) => handleToggle(event, screen, "cone")}
              />
            </div>
          </div>
          <div className="bx--row custom__row">
            <div className="bx--col">
              <TextInput
                value={initialMeasure}
                onChange={(event) =>
                  onInputChange(event, screen, "initialMeasure")
                }
                {...inputProps2("Inicio regla nivel (en cm)")}
              />
            </div>
            <div className="bx--col">
              <TextInput
                value={finalMeasure}
                onChange={(event) => onInputChange(event, screen, "finalMeasure")}
                {...inputProps2("Fin regla nivel (en cm)")}
              />
            </div>
          </div>
          <div className="bx--row custom__row">
            <div className="bx--col">
              <TextInput
                disabled
                value={totalCm || tot_cm}
                {...inputProps2("Total en cm")}
              />
            </div>
            <div className="bx--col">
              <TextInput
                disabled
                value={totalLitres || tot_lt}
                {...inputProps2("Total en litros")}
              />
            </div>
          </div>
          <div className="bx--row custom__row">
            <div className="bx--col">
              <TextInput
                disabled
                value={oilWeight}
                {...inputProps2("Kg aceite")}
              />
            </div>
            <div className="bx--col">
              <TextInput disabled value={perf} {...inputProps2("Rendimiento")} />
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
      disabled={validateStep2(payload)}
    />
  </>);
};

export default Storage;
