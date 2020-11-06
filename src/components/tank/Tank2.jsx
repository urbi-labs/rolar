import React, { Fragment, useState, useEffect } from "react";
import { TextInput } from "carbon-components-react";

// custom components
import Buttons from "../common/Buttons.jsx";
import StepTitles from "../common/StepTitles.jsx";
import Validated from "../common/Validated.jsx";

// custom services and helper functions
import { getStoragesByTank } from "../../services/apiService";
import { calcTotalLitres } from "../../util/helpers";
import { fecha, hora } from "../../util/formats.js";

const screen = "tank";

const inputProps = (labelText) => ({
  id: labelText,
  labelText,
  light: true,
  size: "sm",
  type: "number",
});

export default function Tank2({ step, submit, data, onCheckChange }) {
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

  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <StepTitles title="Cierre de tanques" step="2" />
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
              {...inputProps("Litros totales")}
            />
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
      />
    </Fragment>
  );
}
