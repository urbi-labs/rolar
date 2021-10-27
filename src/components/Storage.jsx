import React, { useState, useEffect } from "react";
import Buttons from "./common/Buttons.jsx";
import StepTitles from "./common/StepTitles.jsx";
import { ComboBox, TextInput, Toggle } from "carbon-components-react";
import Validated from "./common/Validated.jsx";

// services and utility functions
import { calcs, calcs2 } from "./../util/helpers";
import { getBatchById } from "./../services/apiService";

function validateStep1(payload) {
  const { _batch } = payload;
  return !!!_batch;
}

function validateStep2(payload, tot_lt) {
  const { _tank, initialMeasure, finalMeasure, cone } = payload;
  const valid = (cone) ? (_tank && initialMeasure && finalMeasure) : (_tank && tot_lt);
  return !(valid);
}

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

const Storage = ({
  data,
  step,
  submit,
  onComboChange,
  onInputChange,
  handleToggle,
  onCheckChange,
  onInputValueChange,
  globalSupervisor
}) => {
  const { payload, supervisor } = data;

  const { batches, tanks } = data.init;
  console.log('TANKSS ', tanks)
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
  const [enabledInputs, setEnabledInputs] = useState(false);
  const [showField, setShowField] = useState(false);
  const [textEdit, setTextEdit] = useState('Editar');
  const [batch, setBatch] = useState({});

  const [measure, setMeasure] = useState({ 'initialMeasure': 0, 'finalMeasure': 0 });
  // const [finalMeasureA, setFinalMeasure] = useState(0);
  const [tot_cm, setTot_cm] = useState(0);
  const [tot_lt, setTot_lt] = useState(0);
  const [oilWeight, setOilWeight] = useState(0);
  const [perf, setPerf] = useState(0);

  useEffect(() => {

    const enabled = globalSupervisor ? true : false;
    setEnabledInputs(enabled);

    async function initBatch(id) {
      const batch_obj = await getBatchById(id);
      console.log("batch_obj  ", batch_obj);
      const { data } = batch_obj;
      setBatch(data);
    }
    if (_batch) {
      initBatch(_batch);
    }

    if (totalCm) {
      
      setMeasure(prevState => ({
        ...prevState,
        initialMeasure: initialMeasure,    
        finalMeasure: finalMeasure, 
      }));

      setTot_cm(totalCm);
      setTot_lt(totalLitres);
    }

    if(measure){ 
      onCalc( measure.initialMeasure, measure.finalMeasure, cone, tanks[tankIndex], batch.netWeight)
    }

  }, [_batch, measure]);

  const onEdit = (boolean) => {
    setEnabledInputs(boolean);
    setTextEdit('Guardar');
  }

  const onSubmit = (screen, feedback) => {
    if ((supervisor) && (typeof feedback == "undefined") && !validated) {
      alert('Para validar debe hacer check en el campo validado');
      return false;
    }

    setEnabledInputs(true);
    setTextEdit('Editar');
    submit(screen, feedback);
  }

  const onHandleToggle = (event, screen, field) => {
    setShowField(event);

    setOilWeight(0);
    setPerf(0);
    setTot_lt(0);
    setTot_cm(0);
    setMeasure(prevState => ({
      ...prevState,
      initialMeasure: 0,    
      finalMeasure: 0, 
    }));

    onInputValueChange(0, screen, 'initialMeasure');
    onInputValueChange(0, screen, 'finalMeasure');

    handleToggle(event, screen, field);
  }

  const onInputTotalLitresChange = (event, screen, field) => {
    let { oilWeight, perf } = calcs2(event, batch.netWeight);

    setOilWeight(oilWeight);
    setPerf(perf);
    setTot_lt(event.target.value);

    onInputChange(event, screen, field);
  }

  const onLocalInputChange = (event, screen, field) => { 
    const { value } = event.target;
    setMeasure(prevState => ({
      ...prevState,
      [field]: value  
    }));

    onInputChange(event, screen, field);
  }

  const onCalc = () => {
    
    let { tot_cm, tot_lt, oilWeight, perf } = calcs(
      measure.initialMeasure,
      measure.finalMeasure,
      cone,
      tanks[tankIndex],
      batch.netWeight
    );

    setTot_cm(tot_cm);
    setTot_lt(tot_lt);
    setOilWeight(oilWeight);
    setPerf(perf);

  }

  // let { tot_cm, tot_lt, oilWeight, perf } = calcs(
  //   initialMeasure,
  //   finalMeasure,
  //   cone,
  //   tanks[tankIndex],
  //   batch.netWeight
  // );

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
            onChange={(event) => onComboChange(event, "storage", "_batch")}
            {...comboProps1("Lote")}
          />
        </div>
      </div>

      {!validateStep1(payload) &&
        <>
          <div className="bx--row custom__row">
            <div className="bx--col-sm-3">
              <ComboBox
                items={tanks}
                itemToString={(item) => (item ? item.text : "")}
                onChange={(event) => onComboChange(event, "storage", "_tank")}
                {...comboProps2("Tanque")}
                selectedItem={tanks[tankIndex]}
                disabled={enabledInputs}
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
                onToggle={(event) => onHandleToggle(event, "storage", "cone")}
              />
            </div>
          </div>
          {showField &&
            <div className="bx--row custom__row">
              <div className="bx--col">
                <TextInput
                  value={measure.initialMeasure}
                  onChange={(event) =>
                    onLocalInputChange(event, "storage", "initialMeasure")
                  }
                  {...inputProps2("Inicio regla nivel (en cm)")}
                  disabled={enabledInputs}
                />
              </div>
              <div className="bx--col">
                <TextInput
                  value={measure.finalMeasure}
                  onChange={(event) => onLocalInputChange(event, "storage", "finalMeasure")}
                  {...inputProps2("Fin regla nivel (en cm)")}
                  disabled={enabledInputs}
                />
              </div>
            </div>
          }

          <div className="bx--row custom__row">
            {showField &&
              <div className="bx--col">
                <TextInput
                  disabled
                  // value={totalCm || tot_cm}
                  value={tot_cm}
                  {...inputProps2("Total en cm")}
                  disabled={enabledInputs}
                />
              </div>
            }
            <div className="bx--col">
              <TextInput
                disabled={showField}
                // value={totalLitres || tot_lt}
                value={tot_lt}
                onChange={(event) => onInputTotalLitresChange(event, "storage", "totalLitres")}
                {...inputProps2("Total en litros")}

              />
            </div>
          </div>
          <div className="bx--row custom__row">
            <div className="bx--col">
              <TextInput
                disabled
                // value={oilWeight || oilWeightCalc}
                value={oilWeight}
                {...inputProps2("Kg aceite")}
              />
            </div>
            <div className="bx--col">
              <TextInput
                disabled
                // value={perf || perfCalc} 
                value={perf}
                {...inputProps2("Rendimiento")}
              />

            </div>
          </div>
          <Validated
            mode={supervisor}
            screen={"storage"}
            onCheckChange={onCheckChange}
            validated={validated}
          />
        </>
      }


    </div>
    <Buttons
      screen={"storage"}
      left="Cancelar"
      right={supervisor ? "Validar" : "Registrar"}
      onStep={step}
      onSubmit={onSubmit}
      disabled={validateStep2(payload, tot_lt)}
      rightEdit={textEdit}
      onEdit={onEdit}
      enabledInputs={enabledInputs}
      supervisor={globalSupervisor}
    />
  </>);
};

export default Storage;
