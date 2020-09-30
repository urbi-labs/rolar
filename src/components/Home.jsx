import React, { Component } from "react";
import Batch from "./Batch";
import Template from "./common/Template";

import "../styles/home.scss";
import { sections } from "../config.json";

class Home extends Component {
  state = {
    batch: {
      payload: {},
      step: 0,
    },
    screen: "",
  };

  renderScreen = (screen) => {
    const { batch } = this.state;
    const component = {
      batch: (
        <Batch
          data={batch}
          step={this.handleStep}
          submit={this.handleSubmit}
          restart={this.handleRestart}
        />
      ),
      sample: <div>Nuevo Lote</div>,
      mill: <div>Nuevo Lote</div>,
      cent: <div>Nuevo cent</div>,
      storage: <div>Nuevo Lote</div>,
      tank: <div>Nuevo Lote</div>,
    };
    return component[screen];
  };

  handleBatch = (screen) => {
    this.setState({ screen }, () => console.log(this.state));
  };

  handleStep = (screen, next = true, reset) => {
    const newState = { ...this.state };
    const data = newState[screen];
    const { step } = data;
    newState.screen = screen;

    data.step = next ? step + 1 : step - 1;
    if (data.step < 0) {
      data.step = 0;
      newState.screen = "";
    }

    newState[screen] = data;
    this.setState(newState, () => console.log(this.state));
  };

  handleRestart = (screen) => {
    const newState = { ...this.state };
    const data = newState[screen];
    data.step = 0;
    newState.screen = "";
    this.setState(newState, () => console.log(this.state));
  };

  handleSubmit = (screen) => {
    const newState = { ...this.state };
    console.log("registrando informacion...");

    newState[screen].step = 2;
    this.setState(newState, () => console.log(this.state));
  };

  render() {
    const { screen } = this.state;

    if (screen) return this.renderScreen(screen);

    return (
      <div className="home__container">
        <div className="home__wrapper">
          {sections.map((section, i) => {
            const { key, label } = section;
            return (
              <div
                className="home__tile"
                key={i}
                onClick={() => this.handleBatch(key)}
              >
                <div className="home__tile-button">
                  <img src={`/images/${key}.png`} alt={key} />
                </div>
                <div className="home__tile-label">{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Template(Home);
