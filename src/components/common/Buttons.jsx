import React from "react";
import { Button } from "carbon-components-react";
import ReactTooltip from "react-tooltip";

const Buttons = ({ left, right, onStep, onSubmit, screen, disabled }) => {
  return (
    <div className="bx--grid bx--grid--full-width buttons">
      <div className="bx--row">
        <div className="center-btn bx--col bx--no-gutter padding_top">
          <Button
            kind="tertiary"
            size="small"
            onClick={() => onStep(screen, false)}
          >
            {left}
          </Button>
        </div>
        <div className="center-btn bx--col bx--no-gutter padding_top">
          <Button
            disabled={disabled}
            kind="tertiary"
            size="small"
            data-tip="Revisar los valores seleccionados"
            onClick={() => (onSubmit ? onSubmit(screen) : onStep(screen))}
          >
            {right}
          </Button>
          <ReactTooltip
            effect="solid"
            place="top"
            html={true}
            clickable={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Buttons;
