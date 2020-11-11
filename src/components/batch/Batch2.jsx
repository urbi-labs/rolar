import React, { Fragment } from "react";
import { ComboBox, TextInput } from "carbon-components-react";

// custom components
import Validated from "../common/Validated.jsx";
import Buttons from "../common/Buttons.jsx";
import StepTitles from "../common/StepTitles.jsx";

import "../../styles/batch.scss";

// Docs ComboBox: https://react.carbondesignsystem.com/?path=/story/combobox--default
// Docs TextInput: https://react.carbondesignsystem.com/?path=/story/textinput--default

const screen = "batch";

const comboProps = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción...",
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
});

const Batch2 = ({
  step,
  submit,
  data,
  onComboChange,
  onInputChange,
  onCheckChange,
  disabled,
}) => {
  console.log("rendering Batch2...");
  if (!data) return "Cargando...";
  let items = [];
  const { supervisor } = data;
  const {
    client,
    chuteWeight,
    grossWeight,
    receiptNumber,
    deliveryNumber,
    chuteName,
    validated,
  } = data.payload;
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
                onChange={(event) => onComboChange(event, screen, "chuteName")}
                {...comboProps("Nro. Tolva")}
                selectedItem={
                  items[items.findIndex((i) => i.text === chuteName)]
                }
              />
            ) : (
              <TextInput
                onChange={(event) => onInputChange(event, screen, "chuteName")}
                {...inputProps("Nro. Tolva")}
                value={chuteName}
              />
            )}
          </div>
          <div className="bx--col">
            <TextInput
              disabled={preset}
              onChange={(event) => onInputChange(event, screen, "chuteWeight")}
              {...inputProps("Tara")}
              value={chuteWeight}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, screen, "grossWeight")}
              {...inputProps("KG Bruto")}
              value={grossWeight}
            />
          </div>
          <div className="bx--col">
            <TextInput
              disabled={true}
              value={grossWeight - chuteWeight}
              {...inputProps("KG Neto")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, screen, "deliveryNumber")
              }
              {...inputProps("Nro. Remito")}
              value={deliveryNumber}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) =>
                onInputChange(event, screen, "receiptNumber")
              }
              {...inputProps("Nro. Recibo")}
              value={receiptNumber}
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
        disabled={disabled}
      />
    </Fragment>
  );
};

export default Batch2;
