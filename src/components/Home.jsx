import React, { Component } from "react";
import Batch from "./Batch";
import Feedback from "./Feedback";
import Template from "./common/Template";

import "../styles/home.scss";
import { sections } from "../config.json";

// Settings for batch section
import { clients, oliveTypes } from "../config.json";

// Services
import { submitBatch } from "../services/apiService";

class Home extends Component {
  state = {
    batch: {
      payload: {
        _user: "5f4fe8cd71164f1d5d65ae04",
        client: "Rolar de Cuyo SA",
        parcel: "2",
        oliveType: "Coratina",
        chuteName: "100",
        chuteWeight: 2700,
        grossWeight: 4700,
        netWeight: 2000,
        deliveryNumber: "0001-123000A",
        receiptNumber: "ABX123",
      },
      init: {},
      step: 0,
    },
    sample: {
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
          onComboChange={this.handleComboChange}
          onInputChange={this.handleInputChange}
        />
      ),
      sample: <div>Nuevo Lote</div>,
      mill: <div>Nuevo Lote</div>,
      cent: <div>Nuevo cent</div>,
      storage: <div>Nuevo Lote</div>,
      tank: <div>Nuevo Lote</div>,
      feedback: (
        <Feedback
          label="lalala"
          serial="123"
          restart={this.handleRestart}
        ></Feedback>
      ),
    };
    return component[screen];
  };

  handleOnClick = (screen) => {
    const newState = { ...this.state };
    const initSection = {
      batch: this.initializeBatch,
      sample: <div>Nuevo Lote</div>,
      mill: <div>Nuevo Lote</div>,
      cent: <div>Nuevo cent</div>,
      storage: <div>Nuevo Lote</div>,
      tank: <div>Nuevo Lote</div>,
    };

    newState[screen].init = initSection[screen]();
    newState.screen = screen;

    this.setState(newState, () => console.log(this.state));
  };

  initializeBatch = () => {
    return {
      clients,
      parcels: [...Array(15).keys()].map((x, i) => {
        return { id: i, text: ++x + "" };
      }),
      oliveTypes,
    };
  };

  handleComboChange = (event, screen, field) => {
    const newState = { ...this.state };

    newState[screen].payload[field] = event.selectedItem
      ? event.selectedItem.text
      : "";

    if (field === "chuteName")
      newState[screen].payload.chuteWeight = event.selectedItem
        ? event.selectedItem.value
        : "0";

    this.setState(newState, () => console.log(this.state));
  };

  handleInputChange = (event, screen, field) => {
    const newState = { ...this.state };
    newState[screen].payload[field] = event.target.value || 0;
    this.setState(newState, () => console.log(this.state));
  };

  handleStep = (screen, next = true) => {
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

  handleSubmit = async (screen) => {
    const newState = { ...this.state };
    console.log("registrando informacion... ", screen);
    // Submit Logic
    const { payload } = newState[screen];
    const { data } = await submitBatch(payload);
    console.log({ data });
    newState.screen = "feedback";
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
                onClick={() => this.handleOnClick(key)}
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
