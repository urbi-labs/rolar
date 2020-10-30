import React from "react";
import { Button } from "carbon-components-react";

const Buttons = ({ left, right, onStep, onSubmit, screen, disabled }) => {
  return (
    <div className="bx--grid bx--grid--full-width buttons">
      <div className="bx--row">
        <div className="center-btn bx--col bx--no-gutter">
          <Button
            kind="tertiary"
            size="small"
            onClick={() => onStep(screen, false)}
          >
            {left}
          </Button>
        </div>
        <div className="center-btn bx--col bx--no-gutter">
          <Button
            disabled={disabled}
            kind="tertiary"
            size="small"
            onClick={() => (onSubmit ? onSubmit(screen) : onStep(screen))}
          >
            {right}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Buttons;
