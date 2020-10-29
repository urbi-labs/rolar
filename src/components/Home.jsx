import React, { Component } from "react";
import Batch from "./Batch";
import Feedback from "./Feedback";
import Template from "./common/Template";
import Sample from "./Sample";
import Storage from "./Storage";
import Mill from "./Mill";
import Cent from "./Cent";
import Tank from "./Tank";
import "../styles/home.scss";
import { sections, prodLine } from "../config.json";

// Settings for batch section
import { clients, oliveTypes } from "../config.json";

// Services
import {
  submitBatch,
  tookSampleBatch,
  NotSampleBatches,
  getBatches,
  getStoragesFromTank,
  getTanks,
  getAllTanks,
  submitCent,
  submitMill,
  submitStorage,
  submitTank,
  submitSample,
  getBatchById,
  updateStatus,
  getBatchesByStatus,
} from "../services/apiService";
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
        deliveryNumber: "0001-123000A",
        receiptNumber: "ABX123",
      },
      init: {},
      step: 0,
    },
    tank: {
      payload: {
        _user: "5f4fe8cd71164f1d5d65ae04",
        batchArray: [],
        _tank: "",
      },
      init: {},
      step: 0,
    },
    storage: {
      payload: {
        _batch: "",
        _user: "5f4fe8cd71164f1d5d65ae04",
        _tank: "",
        initialMeasure: 0,
        finalMeasure: 0,
        coneValue: 0,
        cone: false,
        radius: 0,
      },
      init: {},
      step: 0,
    },
    cent: {
      payload: {
        _batch: "",
        _user: "5f4fe8cd71164f1d5d65ae04",
        productionLine: "",
        initialTemp: 30,
        finalTemp: 40,
        kneadingTime: 2,
        pumpSpeed: 40,
      },
      init: {},
      step: 0,
    },
    mill: {
      payload: {
        _batch: "",
        _user: "5f4fe8cd71164f1d5d65ae04",
        productionLine: "",
        sieve: "",
        microtalcum: 300,
        enzymes: 300,
      },
      init: {},
      step: 0,
    },
    sample: {
      payload: {
        _batch: "5f5695c6573a414b3a847952",
        _user: "5f4fe8cd71164f1d5d65ae04",
        hidraulicOil: false,
        frost: 0,
        mummified: 0,
        dehydrated: 0,
        beaten: 0,
        waterExcess: 0,
        branchExcess: 0,
        leafExcess: 0,
        maturityIndex: 0,
        moisturePase: 0,
        wetFat: 0,
        dryFat: 0,
        taurusPomace: 0,
        rexPomace: 0,
      },
      step: 0,
      init: {},
    },
    screen: "",
  };

  renderScreen = (screen) => {
    const { batch, sample, tank, mill, cent, storage } = this.state;
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
      sample: (
        <Sample
          data={sample}
          step={this.handleStep}
          onComboChange={this.handleComboChange}
          onInputChange={this.handleInputChange}
          submit={this.handleSubmit}
          handleToggle={this.handleToggle}
        />
      ),
      mill: (
        <Mill
          data={mill}
          step={this.handleStep}
          onComboChange={this.handleComboChange}
          onInputChange={this.handleInputChange}
          submit={this.handleSubmit}
          handleMillSlider={this.handleMillSlider}
        />
      ),
      cent: (
        <Cent
          data={cent}
          step={this.handleStep}
          submit={this.handleSubmit}
          onComboChange={this.handleComboChange}
          onInputChange={this.handleInputChange}
          handleCentSlider={this.handleCentSlider}
        />
      ),
      storage: (
        <Storage
          data={storage}
          step={this.handleStep}
          submit={this.handleSubmit}
          onComboChange={this.handleComboChange}
          onComboChangeID={this.handleComboChangeID}
          onInputChange={this.handleInputChange}
          getPerformance={this.getPerformance}
          handleToggle={this.handleToggle}
        />
      ),
      tank: (
        <Tank
          data={tank}
          step={this.handleStep}
          submit={this.handleSubmit}
          onComboChange={this.handleComboChange}
          onComboChangeID={this.handleComboChangeID}
          getStoragesFromTank={this.getStoragesFromTank}
          onInputChange={this.handleInputChange}
        />
      ),

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

  handleOnClick = async (screen) => {
    const newState = { ...this.state };

    const initSection = {
      batch: this.initializeBatch,
      sample: this.getSampleBatches,
      mill: this.getMillBatches,
      cent: this.getCentBatches,
      storage: this.getStorageBatches,
      tank: this.initializeWithTanks,
    };

    newState[screen].init = await initSection[screen]();
    newState.screen = screen;

    this.setState(newState, () => console.log(this.state));
  };

  getSampleBatches = async () => {
    const { data } = await NotSampleBatches();
    console.log(data);
    const items = [];
    data.forEach((doc, ind) => {
      console.log(doc);
      items.push({
        /*...doc,*/
        id: ind + "",
        text: doc._id,
      });
    });
    console.log(items);
    return items;
  };

  getMillBatches = async () => {
    const batches = await this.getBatchesArray("batch");

    return { batches, prodLine };
  };

  getCentBatches = async () => {
    const batches = await this.getBatchesArray("mill");

    return { batches, prodLine };
  };

  getStorageBatches = async () => {
    const batches = await this.getBatchesArray("cent");
    const tanks = await getAllTanks();
    return {
      batches,
      tanks,
    };
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

  getPerformance = async () => {
    //Traer netWeight del batch
    const { _batch } = this.state.storage.payload;
    if (_batch !== "") {
      //const response = await getBatchById(_batch);
      //TODO: Refactor or reimagine this
    }
  };

  getBatchesArray = async (status) => {
    const { data } = await getBatchesByStatus(status);
    const items = [];
    data.forEach((doc, ind) => {
      console.log(doc);
      items.push({
        /*...doc,*/
        id: ind + "",
        text: doc._id,
      });
    });
    console.log(items);
    return items;
  };

  initializeWithTanks = async () => {
    const { data } = await getTanks();
    const items = [];
    data.forEach((doc, ind) => {
      console.log(doc);
      items.push({
        /*...doc,*/
        id: doc._id,
        text: "Tanque " + doc.name,
      });
    });
    console.log(items);
    return items;
  };

  getStoragesFromTank = async (_tank) => {
    const { data: storages } = await getStoragesFromTank(_tank);
    const newState = { ...this.state };
    const items = [];

    storages.forEach((elem, index) => {
      items.push(elem);
    });
    newState["tank"].payload["batchArray"] = items;
    this.setState(newState, () => console.log(this.state));
  };

  handleComboChangeID = (event, screen, field) => {
    const newState = { ...this.state };

    newState[screen].payload[field] = event.selectedItem
      ? event.selectedItem.id
      : "";

    this.setState(newState, () => console.log(this.state));
  };

  handleComboChange = (event, screen, field) => {
    const newState = { ...this.state };

    console.log(event);

    newState[screen].payload[field] = event.selectedItem
      ? event.selectedItem.text
      : "";

    if (field === "chuteName")
      newState[screen].payload.chuteWeight = event.selectedItem
        ? parseInt(event.selectedItem.value)
        : 0;

    this.setState(newState, () => console.log(this.state));
  };

  handleInputChange = (event, screen, field) => {
    const newState = { ...this.state };
    newState[screen].payload[field] = event.target.value || 0;
    this.setState(newState, () => console.log(this.state));
  };

  handleMillSlider = (event, value, screen, field) => {
    const newState = { ...this.state };
    console.log(event);
    console.log("registrando información del mill slider");
    newState[screen].payload[field] = value || 0;
    this.setState(newState, () => console.log(this.state));
  };

  handleCentSlider = (event, value) => {
    const newState = { ...this.state };
    console.log(event);
    newState.cent.payload.initialTemp = value[0];
    newState.cent.payload.finalTemp = value[1];
    console.log(newState);
    this.setState(newState, () => console.log(this.state));
  };

  handleToggle = (event, screen, field) => {
    console.log("toggle changing");
    console.log(event);
    const newState = { ...this.state };
    newState[screen].payload[field] = event;
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

  /*  handleSubmit = async (screen) => {
    const newState = { ...this.state };
    console.log("registrando informacion... ", screen);
    // Submit Logic
    //TODO: Screen logic
    const { payload } = newState[screen];
    const { data } = await submitBatch(payload);
    console.log({ data });
    newState.screen = "feedback";
    this.setState(newState, () => console.log(this.state));
  }; */

  handleSubmit = async (screen) => {
    const newState = { ...this.state };
    const { payload } = newState[screen];
    const { _batch } = payload;
    const status = {
      status: screen,
    };
    console.log("registrando informacion... ", screen);

    switch (screen) {
      case "batch":
        await submitBatch(payload);
        break;

      case "sample":
        await submitSample(payload);
        await tookSampleBatch(_batch);
        break;

      case "mill":
        await submitMill(payload);
        const resp = await updateStatus(_batch, status);
        console.log(resp);
        break;

      case "cent":
        await submitCent(payload);
        await updateStatus(_batch, status);
        break;
      case "storage":
        delete payload.radius;
        delete payload.coneValue;
        await submitStorage(payload);
        await updateStatus(_batch, status);
        //actualizar active del tanque
        break;

      case "tank":
        await submitTank(payload);
        break;

      default:
        console.log("No screen recognized");
    }
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
                onClick={async () => await this.handleOnClick(key)}
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
