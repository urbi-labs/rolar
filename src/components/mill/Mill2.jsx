import React, { Fragment } from "react";
import Slider from "@material-ui/core/Slider";
import { ComboBox, TextInput } from "carbon-components-react";
import Buttons from "../common/Buttons.jsx";
import "../../styles/batch.scss";
//import ReactSlider from 'react-slider'

const comboProps = (titleText) => ({
  id: titleText,
  placeholder: "Cribas",
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


const Mill2 = ({step, submit, data, onComboChange, onInputChange, handleMillSlider }) => {
  console.log("rendering Mill2...");

  if (!data) return "Cargando...";

  const items = [
    { "id": "1", "text": "Criba 1" },
    { "id": "2", "text": "Criba 2" }]


  return (
    <Fragment>
       <div className="bx--grid bx--grid--full-width">
        <div className="bx--row custom__row">
          <div className="bx--col ">Paso1</div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col"> Lote Fecha Hora </div>
          {/*Agregar Lote correspondiente*/}
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
               <ComboBox
                items={items}
                itemToString={(item) => (item ? item.text : "")}
                onChange={(event) => onComboChange(event, "mill", "sieve")}
                {...comboProps("Nro. Criba")}
              />
          </div>
          <div className="bx--col">
            <TextInput
             //disabled={preset}
              //value={chuteWeight || 0}
              onChange={(event) => onInputChange(event, "mill", "microtalcum")}
              {...inputProps("Microtalco")}
            />
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
          <span > Enzimas</span>
          <Slider
            defaultValue={350}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="on" 
            step={50}
            min={0}
            max={500}
            onChange={ (event, value )=>handleMillSlider(event,value,"mill","enzymes")}
          />
        </div>
      </div>
      <Buttons
        screen="mill"
        left="Anterior"
        right="Registrar"
        onStep={step}
        onSubmit={submit}
      />
       </div>
    </Fragment>
    
  );
};

export default Mill2;
