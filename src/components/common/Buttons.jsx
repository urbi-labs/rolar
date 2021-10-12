import React from "react";
import { Button } from "carbon-components-react";
import ReactTooltip from "react-tooltip";

const Buttons = ({ left, right, onStep, onSubmit, screen, disabled, rightEdit, onEdit, enabledInputs, supervisor }) => {
  return (
    <div className="bx--grid bx--grid--full-width buttons">
      <div className="bx--row space">
        <div className="center-btn bx--col bx--no-gutter padding-top">
          <Button
            kind="tertiary"
            size="small"
            onClick={() => onStep(screen, false)}
          >
            {left}
          </Button>
        </div>
        <div className="center-btn bx--col bx--no-gutter inline-buttons">
          {supervisor &&
            <Button
              kind="tertiary"
              size="small"
              onClick={() => (!enabledInputs ? onSubmit(screen, false) : onEdit(false))}
            >
              {rightEdit}
            </Button>
          }

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
