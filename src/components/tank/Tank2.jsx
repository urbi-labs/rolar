import React, { Fragment } from "react";
import { ComboBox, TextInput } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";

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
  
  
export default function Tank2({step, submit, data, onComboChange, onInputChange, getPerformance}) {
    console.log("[DEBUG]")
    console.log(data)

    const { batchArray } = data.payload;

    const calculateTotalLitres = () => {
      let totalLitres = 0
      batchArray.map(e => {
        totalLitres += e.totalLitres;
      });
      return Math.round(totalLitres * 100) / 100;
    }

    return (
        <Fragment>
      <div className="bx--grid bx--grid--full-width">
        <div className="bx--row custom__row">
          <div className="bx--col ">Paso 2</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col"> Lote </div>
          <div className="bx--col"> Fecha </div>
          <div className="bx--col"> Hora</div>
        </div>
          {batchArray.map((e) => {
            let { _batch, timestamp } = e;
            const date = new Date(timestamp);
            _batch = _batch.substring(_batch.length - 5, _batch.length);
            const fullDate = date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear();
            const fullTime = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
            return (
              <div className="bx--row custom__row">
                <div className="bx--col"> 
                  {_batch}
                </div>
                <div className="bx--col"> 
                {fullDate}
                </div>
                <div className="bx--col"> 
                {fullTime}
                </div>
                
              </div>
              );
          })}
        <div className="bx--row custom__row">
          <div className="bx--col">
              <TextInput
                disabled={true}
                value={calculateTotalLitres() || 0}
                {...inputProps("Litros totales")}
              />
            </div>
        </div>
      </div>
      <Buttons
        screen="tank"
        left="Anterior"
        right="Registrar"
        onStep={step}
        onSubmit={submit}
      />
    </Fragment>
    )
}

