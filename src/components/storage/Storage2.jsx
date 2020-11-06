import React, { Fragment, useState, useEffect } from "react";
import { ComboBox, TextInput, Toggle } from "carbon-components-react";
import { calcs } from "../../util/calcs";
import { getBatchById } from "../../services/apiService";
import Buttons from "../common/Buttons.jsx";
import StepTitles from "../common/StepTitles.jsx";
import Validated from "../common/Validated.jsx";

const screen = "storage";

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
  onCheckChange,
  handleToggle,
  disabled,
}) {
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

  const { tanks } = data.init;
  const { supervisor } = data;
  const [batch, setBatch] = useState({});
  useEffect(() => {
    async function initBatch(id) {
      const { data } = await getBatchById(id);
      setBatch(data);
    }
    initBatch(_batch);
  }, []);

  const tankIndex = tanks.findIndex((i) => i.value === _tank);
  const { tot_cm, tot_lt, oilWeight, perf } = calcs(
    initialMeasure,
    finalMeasure,
    cone,
    tanks[tankIndex],
    batch.netWeight
  );

  console.log({ screen });
  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <StepTitles title="Ingreso almacenamiento" step="2" />
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={tanks}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, screen, "_tank")}
              {...comboProps("Tanque destino")}
              selectedItem={tanks[tankIndex]}
            />
          </div>
          <div className="bx--col">
            <Toggle
              id="cone-toggle"
              aria-label="cono"
              labelText="¿Cono lleno?"
              onToggle={(event) => handleToggle(event, screen, "cone")}
              toggled={cone}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, screen, "initialMeasure")
              }
              {...inputProps("Inicio regla nivel")}
              value={initialMeasure}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, screen, "finalMeasure")}
              {...inputProps("Fin regla nivel")}
              value={finalMeasure}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              disabled
              value={totalCm || tot_cm}
              {...inputProps("Total en cm")}
            />
          </div>
          <div className="bx--col">
            <TextInput
              disabled
              value={totalLitres || tot_lt}
              {...inputProps("Total en litros")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              disabled
              value={oilWeight}
              {...inputProps("Kg aceite")}
            />
          </div>
          <div className="bx--col">
            <TextInput disabled value={perf} {...inputProps("Rendimiento")} />
          </div>
        </div>
        <Validated
          mode={supervisor}
          screen={screen}
          onCheckChange={onCheckChange}
          validated={validated}
        />
      </div>
      <Buttons
        screen={screen}
        left="Anterior"
        right="Registrar"
        onStep={step}
        onSubmit={submit}
        disabled={disabled}
      />
    </Fragment>
  );
}
