import React, { Fragment } from "react";

// import { fecha, hora } from "../../util/formats";
import paso1 from "../../images/paso1.png";
import paso2 from "../../images/paso2.png";

const StepTitles = ({ title, helper, step }) => {
  return (
    <Fragment>
      <div className="bx--row custom__row">
        <div className="bx--col subtitle">{title}</div>
      </div>
      <div className="bx--row custom__row">
        <div className="bx--col subtitle">
          <img src={!step ? paso1 : paso2} alt="step" />
        </div>
      </div>
      {/* {step && (
        <div className="bx--row custom__row">
          <div className="bx--col">
            <div className="bx--grid">
              <div className="bx--row">
                {lot && <div className="bx--col">Lote</div>}
                <div className="bx--col">Fecha</div>
                <div className="bx--col">Hora</div>
              </div>
              <div className="bx--row">
                {lot && <div className="bx--col">00000</div>}
                <div className="bx--col time">{fecha()}</div>
                <div className="bx--col time">{hora()}</div>
              </div>
            </div>
          </div>
        </div>
      )} */}
      {helper && (
        <div className="bx--row custom__row">
          <div className="bx--col subtitle">{helper}</div>
        </div>
      )}
    </Fragment>
  );
};

export default StepTitles;
