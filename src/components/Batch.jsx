import React, { useEffect, useState } from "react";
import Buttons from "./common/Buttons.jsx";
import StepTitles from "./common/StepTitles.jsx";
import { ComboBox, TextInput } from "carbon-components-react";

import "../styles/batch.scss";

// custom components
import Validated from "./common/Validated.jsx";

function validateStep1(payload) {
  const { client, parcel, oliveType } = payload;
  return !(client && parcel && oliveType);
}

function validateStep2(payload) {
  const {
    chuteName,
    chuteWeight,
    deliveryNumber,
    grossWeight,
    receiptNumber,
  } = payload;
  return !(
    chuteName &&
    chuteWeight &&
    deliveryNumber &&
    grossWeight &&
    receiptNumber
  );
}

const comboProps1 = (titleText) => ({
  id: titleText,
  placeholder: "Elegir una opción...",
  titleText,
  // helperText: "Optional helper text here",
  light: true,
  invalidText: "Requerido.",
  size: "sm",
  direction: "bottom",
});

const comboProps2 = (titleText) => ({
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

const Batch = ({
  data,
  step,
  submit,
  onComboChange,
  onInputChange,
  onCheckChange,
  supervisor,
}) => {

  const { payload } = data;
  const [enabledInputs, setEnabledInputs] = useState(false);
  const [textEdit, setTextEdit] = useState('Editar');

  useEffect(() => { 
    const enabled = supervisor ? true : false;
    setEnabledInputs(enabled);
  }, []);
  
  const onEdit = (boolean) => { 
    setEnabledInputs(boolean);
    setTextEdit('Guardar');
  }

  const onSubmit = (screen, feedback) => {
    if((supervisor) && (typeof feedback == "undefined") && !validated) { 
      alert('Para validar debe hacer check en el campo validado'); 
      return false; 
    }
    
    setEnabledInputs(true);
    setTextEdit('Editar');
    submit(screen, feedback);
  }

  if (!data) return "Cargando...";
  console.log("batch data: ", data);
  const { clients, parcels, oliveTypes, batches } = data.init;

  let items = [];
  const {
    oliveType,
    client,
    parcel,
    chuteWeight,
    grossWeight,
    receiptNumber,
    deliveryNumber,
    chuteName,
    validated,
  } = data.payload;

  const preset = ["rolar", "acequion"].includes(client);

  if (preset) {
    // para el caso de rolar o acequión, presento valores de tara predefinidas
    const filter = clients.filter((c) => (c.value === client ? c.chutes : ""));
    items = filter[0] ? filter[0].chutes : "";
  }

  return (
    <section>

      <div className="bx--grid bx--grid--full-width">
        <StepTitles
          title={
            supervisor ? "Seleccione un lote a validar" : "Ingresar nuevo lote"
          }
          showSteps={false}
        />
        {/* ex step 1 */}
        {supervisor && (
          <div className="bx--row custom__row">
            <div className="bx--col">
              <ComboBox
                items={batches}
                itemToString={(item) => (item ? item.text : "")}
                onChange={(event) => onComboChange(event, "batch", "_id")}
                {...comboProps1("Lote")}
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
              {...comboProps1("Cliente")}
              disabled={enabledInputs}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={parcels}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "batch", "parcel")}
              {...comboProps1("Cuadro")}
              selectedItem={
                parcels[parcels.findIndex((i) => i.value === parcel)]
              }
              disabled={enabledInputs}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <ComboBox
              items={oliveTypes}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => onComboChange(event, "batch", "oliveType")}
              {...comboProps1("Variedad")}
              selectedItem={
                oliveTypes[oliveTypes.findIndex((i) => i.value === oliveType)]
              }
              disabled={enabledInputs}
            />
          </div>
        </div>

        {/* ex step 2, show only if step 1 is completed */}
        {!validateStep1(payload) &&
          <>
            <div className="bx--row custom__row">
              <div className="bx--col">
                {preset ? (
                  <ComboBox
                    items={items}
                    itemToString={(item) => (item ? item.text : "")}
                    onChange={(event) => onComboChange(event, "batch", "chuteName")}
                    {...comboProps2("Nro. Tolva")}
                    selectedItem={
                      items[items.findIndex((i) => i.text === chuteName)]
                    }
                    disabled={enabledInputs}
                  />
                ) : (
                    <TextInput
                      onChange={(event) => onInputChange(event, "batch", "chuteName")}
                      {...inputProps("Nro. Tolva")}
                      value={chuteName}
                      disabled={enabledInputs}
                    />
                  )}
              </div>
              <div className="bx--col">
                <TextInput
                  disabled={preset}
                  onChange={(event) => onInputChange(event, "batch", "chuteWeight")}
                  {...inputProps("Tara")}
                  value={chuteWeight}
                />
              </div>
            </div>
            <div className="bx--row custom__row">
              <div className="bx--col">
                <TextInput
                  onChange={(event) => onInputChange(event, "batch", "grossWeight")}
                  {...inputProps("KG Bruto")}
                  value={grossWeight ? grossWeight : chuteWeight}
                  min={chuteWeight ? chuteWeight : 0}
                  disabled={enabledInputs}
                />
              </div>
              <div className="bx--col">
                <TextInput
                  disabled={true}
                  value={grossWeight - chuteWeight > 0 ? grossWeight - chuteWeight : 0}
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
                  value={deliveryNumber}
                  disabled={enabledInputs}
                />
              </div>
              <div className="bx--col">
                <TextInput
                  onChange={(event) =>
                    onInputChange(event, "batch", "receiptNumber")
                  }
                  {...inputProps("Nro. Recibo")}
                  value={receiptNumber}
                  disabled={enabledInputs}
                />
              </div>
            </div>
          </>
        }
      </div>
      
      <Validated
        mode={supervisor}
        screen={"batch"}
        onCheckChange={onCheckChange}
        validated={validated}
      />

      <Buttons
        screen="batch"
        left="Cancelar"
        right={supervisor ? "Validar" : "Ingresar"}
        onSubmit={onSubmit}
        onStep={step}
        disabled={validateStep2(payload)}
        rightEdit={textEdit}
        onEdit={onEdit}
        enabledInputs={enabledInputs}
        supervisor={supervisor}
      />
    </section>
  );
};

export default Batch;
