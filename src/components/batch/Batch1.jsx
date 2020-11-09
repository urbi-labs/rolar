import React, { Fragment } from "react";
import { ComboBox } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";
import StepTitles from "../common/StepTitles.jsx";

import "../../styles/batch.scss";

// Docs ComboBox
// https://react.carbondesignsystem.com/?path=/story/combobox--default

const comboProps = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción...",
  titleText,
  // helperText: "Optional helper text here",
  light: true,
  invalidText: "Requerido.",
  size: "sm",
  direction: "bottom",
});



const Batch1 = ({
  step,
  data,
  onComboChange,
  disabled,
  supervisor,
 // batches,
}) => {
  console.log("rendering Batch1...");
  console.log(data);
  if (!data) return "Cargando...";
  const { clients, parcels, oliveTypes, batches } = data.init;
  const {
    oliveType,
    client,
    parcel,
  } = data.payload;
  console.log({ batches });
  console.log(data.payload)
  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <StepTitles
          title={
            supervisor ? "Seleccione un lote a validar" : "Ingresar nuevo lote"
          }
        />

        {supervisor && (
          <div className="bx--row custom__row">
            <div className="bx--col">
              <ComboBox
                items={batches}
                itemToString={(item) => (item ? item.text : "")}
                onChange={(event) => onComboChange(event, "batch", "_id")}
                {...comboProps("Lote")}
              />
            </div>
          </div>
        )}

        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={clients}
              selectedItem={
                clients[clients.findIndex((i) => i.value === client)]
              }
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "batch", "client")}
              {...comboProps("Cliente")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={parcels}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "batch", "parcel")}
              {...comboProps("Cuadro")}
              selectedItem={
                parcels[parcels.findIndex((i) => i.value === parcel)]
              }
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={oliveTypes}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "batch", "oliveType")}
              {...comboProps("Variedad")}
              selectedItem={
                oliveTypes[oliveTypes.findIndex((i) => i.value === oliveType)]
              }
            />
          </div>
        </div>
      </div>

      <Buttons
        screen="batch"
        left="Anterior"
        right="Siguiente"
        onStep={step}
        disabled={disabled}
      />
    </Fragment>
  );
};

export default Batch1;
