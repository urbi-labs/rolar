import React, { Fragment } from "react";
import { ComboBox, TextInput } from "carbon-components-react";
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

const Batch2 = ({ step, submit, data, onComboChange, onInputChange }) => {
  console.log("rendering Batch2...");
  if (!data) return "Cargando...";
  let items = [];

  const { client, chuteWeight } = data.payload;
  const { clients } = data.init;

  const preset = client === "Rolar de Cuyo SA" || client === "Acequión SA";
  if (preset) {
    const filter = clients.filter((c) => (c.text === client ? c.chutes : ""));
    items = filter[0] ? filter[0].chutes : "";
  }
  console.log({ chuteWeight });
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
            {preset ? (
              <ComboBox
                items={items}
                itemToString={(item) => (item ? item.text : "")}
                onChange={(event) => onComboChange(event, "batch", "chuteName")}
                {...comboProps("Nro. Tolva")}
              />
            ) : (
              <TextInput
                onChange={(event) =>
                  onInputChange(event, "batch", "chuteWeight")
                }
                {...inputProps("Nro. Tolva")}
                value={chuteWeight || 0}
              />
            )}
          </div>
          <div className="bx--col">
            <TextInput
              disabled={preset}
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
              onChange={(event) => onInputChange(event, "batch", "netWeight")}
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
      />
    </Fragment>
  );
};

export default Batch2;
