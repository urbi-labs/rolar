import React, { Fragment } from "react";
import { ComboBox, TextInput } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";
import "../../styles/batch.scss";

// Docs ComboBox: https://react.carbondesignsystem.com/?path=/story/combobox--default
// Docs TextInput: https://react.carbondesignsystem.com/?path=/story/textinput--default

const items = [
  {
    id: "rolar",
    text: "Rolar",
  },
];

const props = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción...",
  titleText,
  // helperText: "Optional helper text here",
  light: true,
  disabled: false,
  invalid: false,
  invalidText: "A valid value is required",
  size: "sm",
  direction: "bottom",
  onChange: console.log("onChange"),
  onToggleClick: console.log("onClick"),
});

const inputProps = (labelText) => ({
  // className: "",
  id: labelText,
  // defaultValue: "This is not a default value",
  size: "sm",
  labelText,
  placeholder: "",
  light: true,
  disabled: false,
  hideLabel: false,
  invalid: false,
  invalidText: "A valid value is required",
  // warn: false,
  // warnText: "This will overwrite your current settings",
  // helperText: "Optional help text",
  inline: false,
  onClick: console.log("onClick"),
  onChange: console.log("onChange"),
});

const Batch2 = ({ step, submit }) => {
  console.log("rendering Batch2...");
  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <div className="bx--row custom__row">
          <div className="bx--col ">Paso1</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col"> Fecha Hora Cliente</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={items}
              itemToString={(item) => (item ? item.text : "")}
              {...props("Nro. Tolva")}
            />
          </div>
          <div className="bx--col">
            <TextInput type="text" {...inputProps("Tara")} />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput type="text" {...inputProps("KG Bruto")} />
          </div>
          <div className="bx--col">
            <TextInput type="text" {...inputProps("KG Neto")} />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput type="text" {...inputProps("Nro. Remito")} />
          </div>
          <div className="bx--col">
            <TextInput type="text" {...inputProps("Nro. Recibo")} />
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
