import React from "react";
import Batch1 from "./batch/Batch1";
import Batch2 from "./batch/Batch2";
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
  const { step: screen, payload } = data;
  const section = [
    <Batch1
      step={step}
      data={data}
      onComboChange={onComboChange}
      disabled={validateStep1(payload)}
      supervisor={supervisor}
    />,
    <Batch2
      step={step}
      submit={submit}
      data={data}
      onComboChange={onComboChange}
      onInputChange={onInputChange}
      onCheckChange={onCheckChange}
      disabled={validateStep2(payload)}
    />,
  ];

  console.log("rendering Batch1...");
  console.log(data);
  if (!data) return "Cargando...";
  const { clients, parcels, oliveTypes, batches } = data.init;
  console.log({ batches });
  console.log(data.payload)

  console.log("rendering Batch2...");
  if (!data) return "Cargando...";
  let items = [];
  const { supervisorData } = data;
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
            />
          </div>
        </div>
      
        {/* ex step 2, show only if step 1 is completed */}
        { !validateStep1(payload) &&
        <>
          <div className="bx--row custom__row">
            <div className="bx--col">
              {preset ? (
                <ComboBox
                  items={items}
                  itemToString={(item) => (item ? item.text : "")}
                  onChange={(event) => onComboChange(event, screen, "chuteName")}
                  {...comboProps2("Nro. Tolva")}
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
                value={ grossWeight ? grossWeight : chuteWeight }
                min={ chuteWeight ? chuteWeight : 0 }
              />
            </div>
            <div className="bx--col">
              <TextInput
                disabled={true}
                value={ grossWeight - chuteWeight > 0 ? grossWeight - chuteWeight : 0 }
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
        </>
        }
      </div>

      <Buttons
        screen="batch"
        left="Cancelar"
        right={supervisor ? "Validar":"Ingresar"}
        onStep={step}
        disabled={validateStep2(payload)}
      />
    </section>
  );
};

export default Batch;
