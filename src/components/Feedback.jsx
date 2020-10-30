import React, { Fragment } from "react";
import { Button } from "carbon-components-react";

import "../styles/feedback.scss";
import confir from "../images/confir.png";

const Feedback = ({ label, serial, restart }) => {
  console.log("Feedback llaalalala");
  return (
    <Fragment>
      <div className="bx--grid bx--grid--full-width feeback__container">
        <div className="bx--row custom__row">
          <div className="bx--col">
            <div className="center-btn">
              <img src={confir} alt="Confirmación" />
            </div>
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <div className="subtitle center-btn">{label}</div>
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <div className="helper center-btn">{serial}</div>
          </div>
        </div>
        <div className="bx--row custom__row">
          <div className="bx--col">
            <div className="center-btn bx--col bx--no-gutter">
              <Button
                kind="tertiary"
                size="small"
                onClick={() => restart("batch")}
              >
                Volver a inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Feedback;
