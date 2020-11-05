import React, { Fragment } from "react";
import { ComboBox, TextInput } from "carbon-components-react";

import Buttons from "../common/Buttons.jsx";
import StepTitles from "../common/StepTitles.jsx";

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

const Batch2 = ({
  step,
  submit,
  data,
  onComboChange,
  onInputChange,
  disabled,
}) => {
  console.log("rendering Batch2...");
  if (!data) return "Cargando...";
  let items = [];

  const { client, chuteWeight, grossWeight } = data.payload;
  const { clients } = data.init;

  const preset = ["rolar", "acequion"].includes(client);
  if (preset) {
    // para el caso de rolar o acequión, presento valores de tara predefinidas
    const filter = clients.filter((c) => (c.value === client ? c.chutes : ""));
    items = filter[0] ? filter[0].chutes : "";
  }

  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <StepTitles title="Ingresar nuevo lote" step="2" />
        <div className="bx--row custom__row">
          <div className="bx--col">
            {preset ? (
              <ComboBox
                items={items}
                itemToString={(item) => (item ? item.text : "")}
                onChange={(event) => onComboChange(event, "batch", "chuteName")}
                {...comboProps("Nro. Tolva")}
              />
            ) : (
              <TextInput
                onChange={(event) => onInputChange(event, "batch", "chuteName")}
                {...inputProps("Nro. Tolva")}
              />
            )}
          </div>
          <div className="bx--col">
            <TextInput
              disabled={preset}
              value={chuteWeight || 0}
              onChange={(event) => onInputChange(event, "batch", "chuteWeight")}
              {...inputProps("Tara")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "batch", "grossWeight")}
              {...inputProps("KG Bruto")}
            />
          </div>
          <div className="bx--col">
            <TextInput
              disabled={true}
              // onChange={(event) => onInputChange(event, "batch", "netWeight")}
              value={grossWeight - chuteWeight}
              {...inputProps("KG Neto")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "batch", "deliveryNumber")
              }
              {...inputProps("Nro. Remito")}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, "batch", "receiptNumber")
              }
              {...inputProps("Nro. Recibo")}
            />
          </div>
        </div>
      </div>
      <Buttons
        screen="batch"
        left="Anterior"
        right="Registrar"
        onStep={step}
        onSubmit={submit}
        disabled={disabled}
      />
    </Fragment>
  );
};

export default Batch2;
