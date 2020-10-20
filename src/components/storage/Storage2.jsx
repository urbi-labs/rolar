import React, { Fragment } from 'react'
import { ComboBox, TextInput } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";

const comboProps = (titleText) => ({
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
  

export default function Storage2({step, submit, data, onComboChange, onInputChange, getPerformance}) {
    console.log("[DEBUG]")
    console.log(data)

    const { initialMeasure, finalMeasure, cone, radius } = data.payload;
    const totalLitres = cone * (Math.PI*(((Math.pow(radius/1000,2)*(finalMeasure - initialMeasure)/1000))))*1000; 
    
    const updateTank = (event) => {
      console.log(event)
      if(event !== null && event.selectedItem !== null){
        const { cone, _id, radius } = event.selectedItem;
        //TODO: Refactor code 
        onInputChange({ target: {value: radius } },"storage","radius");
        onInputChange({ target: {value: cone } },"storage","cone");
        onComboChange({ selectedItem: { text: _id } }, "storage", "_tank");
      }
    } 
    return (
        <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <div className="bx--row custom__row">
          <div className="bx--col ">Paso 2</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col"> Lote Fecha Hora</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
          <ComboBox
                items={data.init.tanks.data}
                itemToString={(item) => (!!item ? "Tank " + item.name : "")}
                onChange={(event) => updateTank(event)}
                {...comboProps("Tanque destino")}
              />
          </div>
          <div className="bx--col">
            <TextInput
              disabled={true}
              value={data.payload.cone || 0}
              {...inputProps("Cono")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "storage", "initialMeasure")}
              {...inputProps("Inicio regla nivel")}
            />
          </div>
          <div className="bx--col">
            <TextInput
              onChange={(event) => onInputChange(event, "storage", "finalMeasure")}
              {...inputProps("Fin regla nivel")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              disabled
              value={finalMeasure - initialMeasure}
              {...inputProps("Total en cm")}
            />
          </div>
          <div className="bx--col">
            <TextInput
                disabled
                value={totalLitres}
                {...inputProps("Total en litros")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <TextInput
              disabled
              value={totalLitres * 0.92}
              {...inputProps("Kg aceite")}
            />
          </div>
          <div className="bx--col">
            <TextInput
              disabled
              value={getPerformance(totalLitres * 0.92)}
              {...inputProps("Rendimiento")}
            />
          </div>
        </div>
      </div>
      <Buttons
        screen="storage"
        left="Anterior"
        right="Registrar"
        onStep={step}
        onSubmit={submit}
      />
    </Fragment>
    )
}
