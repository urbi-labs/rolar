import React, { Component } from "react";

// custom components
import Template from "./common/Template";
import Batch from "./Batch";
import Sample from "./Sample";
import Mill from "./Mill";
import Cent from "./Cent";
import Storage from "./Storage";
import Tank from "./Tank";
import Feedback from "./Feedback";

// fixed settings
import { clients, oliveTypes } from "../config.json";
import { sections, prodLine } from "../config.json";
import { feedbackLabels, errorMessages } from "../config.json";

// submit operations
import {
  submitBatch,
  submitSample,
  submitMill,
  submitCent,
  submitStorage,
  submitTank,
} from "../services/apiService";

// update operations (only supervisor mode)
import {
  updateBatch,
  updateSample,
  updateMill,
  updateCent,
  updateStorage,
  updateTank,
} from "../services/apiService";

// DB related operations
import {
  notSampleBatches,
  getByBatchId,
  getBatchesByStatus,
  getBatches,
  getTanks,
  getActiveTanks,
  getBatchById,
  getCentByTankId,
  // getStoragesFromTank,
  // tookSampleBatch,
  // updateStatus,
} from "../services/apiService";

import { getCurrentUser } from "../services/authService";
import { formatID } from "../util/formats";

import "../styles/home.scss";

class Home extends Component {
  state = {};

  componentDidMount = () => {
    const currentUser = getCurrentUser();
    const { role } = currentUser;
    const supervisor = role === "supervisor" ? true : false;
    this.setState({ currentUser, supervisor });
    this.handleRestart();
  };

  handleRestart = () => {
    const newState = {
      batch: {
        payload: {
          _user: "",
          client: "",
          parcel: "",
          oliveType: "",
          chuteName: "",
          chuteWeight: 0,
          grossWeight: 0,
          deliveryNumber: "",
          receiptNumber: "",
        },
        init: {},
        step: 0,
      },
      samples: {
        payload: {
          _batch: "",
          _user: "",
          hidraulicOil: false,
          frost: "",
          mummified: "",
          dehydrated: "",
          beaten: "",
          waterExcess: "",
          branchExcess: "",
          leafExcess: "",
          maturityIndex: "",
          moisturePase: "",
          wetFat: "",
          dryFat: "",
          taurusPomace: "",
          rexPomace: "",
        },
        step: 0,
        init: {},
      },
      mill: {
        payload: {
          _batch: "",
          _user: "",
          productionLine: "Linea 1",
          sieve: "5",
          microtalcum: "",
          enzymes: 250,
        },
        init: {},
        step: 0,
      },
      cent: {
        payload: {
          _batch: "",
          _user: "",
          _tank: "",
          productionLine: "Linea 1",
          initialTemp: "",
          finalTemp: "",
          kneadingTime: "",
          pumpSpeed: "",
        },
        init: {},
        step: 0,
      },
      storage: {
        payload: {
          _batch: "",
          _user: "",
          _tank: "",
          initialMeasure: "",
          finalMeasure: "",
          cone: false,
        },
        init: {},
        step: 0,
      },
      tank: {
        payload: {
          _user: "",
          _tank: "",
          batchArray: [],
        },
        init: {},
        step: 0,
      },
      feedback: { label: "", number: "" },
      screen: "",
    };
    this.setState(newState, () => console.log("handleRestart", this.state));
  };

  renderScreen = (screen) => {
    const { batch, samples, tank, mill, cent, storage, feedback } = this.state;
    const { supervisor } = this.state;
    const { label, number } = feedback;

    const submit = supervisor ? this.handleUpdate : this.handleSubmit;

    const component = {
      batch: (
        <Batch
          data={batch}
          step={this.handleStep}
          submit={submit}
          onComboChange={this.handleComboChange}
          onInputChange={this.handleInputChange}
          onCheckChange={this.handleCheckChange}
          supervisor={supervisor}
        />
      ),
      samples: (
        <Sample
          data={samples}
          step={this.handleStep}
          submit={submit}
          onInputChange={this.handleInputChange}
          onComboChange={this.handleComboChange}
          onCheckChange={this.handleCheckChange}
          handleToggle={this.handleToggle}
        />
      ),
      mill: (
        <Mill
          data={mill}
          step={this.handleStep}
          submit={submit}
          onInputChange={this.handleInputChange}
          onComboChange={this.handleComboChange}
          onCheckChange={this.handleCheckChange}
          handleMillSlider={this.handleMillSlider}
        />
      ),
      cent: (
        <Cent
          data={cent}
          step={this.handleStep}
          submit={submit}
          onInputChange={this.handleInputChange}
          onComboChange={this.handleComboChange}
          onCheckChange={this.handleCheckChange}
          handleCentSlider={this.handleCentSlider}
        />
      ),
      storage: (
        <Storage
          data={storage}
          step={this.handleStep}
          submit={submit}
          onInputChange={this.handleInputChange}
          onComboChange={this.handleComboChange}
          onCheckChange={this.handleCheckChange}
          handleToggle={this.handleToggle}
        />
      ),
      tank: (
        <Tank
          data={tank}
          step={this.handleStep}
          submit={submit}
          onInputChange={this.handleInputChange}
          onComboChange={this.handleComboChange}
          onCheckChange={this.handleCheckChange}
        />
      ),

      feedback: (
        <Feedback
          label={label}
          number={number}
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
      samples: this.initializeSamples,
      mill: this.initializeMills,
      cent: this.initializeCents,
      storage: this.initializeStorage,
      tank: this.initializeTanks,
    };

    // lógica de inicio para sección desde Home
    newState[screen].init = await initSection[screen]();
    newState.screen = screen;

    this.setState(newState, () => console.log(this.state));
  };

  initializeBatch = async () => {
    const { supervisor } = this.state;
    return {
      batches: supervisor ? await this.getBatchesArray() : "",
      clients,
      parcels: [...Array(15).keys()].map((x) => {
        return { id: x, text: x + 1 + "", value: x + 1 };
      }),
      oliveTypes,
    };
  };

  initializeSamples = async () => {
    const { supervisor } = this.state;
    const { data } = await notSampleBatches(supervisor);

    const items = [];
    data.forEach((doc, ind) => {
      const { _id } = doc;
      items.push({
        id: ind,
        text: formatID(doc),
        value: _id,
      });
    });

    // No podemos chequear facilmente si la muestra esta validada.

    return items;
  };

  initializeMills = async () => {
    const { supervisor } = this.state;
    // const status = supervisor ? "mill" : "batch";
    const batches = supervisor
      ? await this.getBatchesArray(["mill", "cent", "storage"])
      : await this.getBatchesArray("batch");

    return { batches, prodLine };
  };

  initializeCents = async () => {
    const { supervisor } = this.state;
    // const status = supervisor ? "cent" : "mill";
    const batches = supervisor
      ? await this.getBatchesArray(["cent", "storage"])
      : await this.getBatchesArray("mill");

    const tanks = await this.getTanks();

    return { batches, prodLine, tanks };
  };

  initializeStorage = async () => {
    const { supervisor } = this.state;
    // const status = supervisor ? "storage" : "cent";
    const batches = supervisor
      ? await this.getBatchesArray("storage")
      : await this.getBatchesArray("cent");

    const tanks = await this.getTanks();

    return {
      batches,
      tanks,
    };
  };

  getTanks = async () => {
    const { data: tanksDB } = await getTanks();

    const tanks = [];
    tanksDB.forEach((doc, ind) => {
      const { _id, name } = doc;
      tanks.push({
        id: ind + "",
        text: `Tanque ${name}`,
        value: _id,
        doc,
      });
    });
    return tanks;
  };

  getBatchesArray = async (status) => {
    const { data } = status
      ? await getBatchesByStatus(status)
      : await getBatches();

    const items = [];
    data.forEach((doc, ind) => {
      const { _id } = doc;
      items.push({
        id: ind + "",
        text: formatID(doc),
        value: _id,
      });
    });
    return items;
  };

  initializeTanks = async () => {
    const { data } = await getActiveTanks();
    const items = [];
    data.forEach((doc, ind) => {
      const { _id, name } = doc;
      items.push({
        id: ind + "",
        text: `Tanque ${name}`,
        value: _id,
      });
    });
    return items;
  };

  handleComboChange = async (event, screen, field) => {
    const newState = { ...this.state };
    const { supervisor } = this.state;
    const { selectedItem } = event;
    const data = newState[screen];

    data.payload[field] = selectedItem ? selectedItem.value : "";
    if (supervisor) data.supervisor = true;

    if (field === "chuteName") {
      data.payload[field] = selectedItem.text;
      data.payload.chuteWeight = selectedItem
        ? parseInt(selectedItem.value)
        : 0;
    }

    console.log(supervisor, data.step, screen);

    // lógica para recuperar datos en vista de supervisor
    // solo para el step1 de sample/mill/cent/storage ["samples","mill","cent","storage"]

    if (supervisor && data.step === 0 && !["batch", "tank"].includes(screen)) {
      const { payload } = data;
      const { _batch } = payload;
      const { data: doc } = await getByBatchId(screen, _batch);
      if (doc) data.payload = doc;
    }

    console.log(screen, data.step);
    if (supervisor && data.step === 0 && screen === "batch") {
      const { payload } = data;
      const { _id } = payload;
      const { data: doc } = await getBatchById(_id);
      console.log(doc);
      if (doc) data.payload = doc;
    }

    // fix por pedido del usuario final, solo para pantalla storage
    if (data.step === 0 && screen === "storage") {
      const { payload } = data;
      const { _batch } = payload;
      const { data: doc } = await getCentByTankId(_batch);
      console.log(doc);
      if (doc) data.payload._tank = doc._tank;
    }

    newState[screen] = data;

    this.setState(newState, () => console.log(this.state));
  };

  handleInputChange = (event, screen, field, max) => {
    const newState = { ...this.state };
    const value = event.target.value || "";
    newState[screen].payload[field] = max
      ? value > max
        ? newState[screen].payload[field]
        : value
      : value;

    this.setState(newState, () => console.log(this.state));
  };

  handleCheckChange = (event, screen, field) => {
    const newState = { ...this.state };
    newState[screen].payload[field] = event;
    this.setState(newState, () => console.log(this.state));
  };

  handleMillSlider = (event, value, screen, field) => {
    const newState = { ...this.state };
    newState[screen].payload[field] = value || 0;
    this.setState(newState, () => console.log(this.state));
  };

  handleCentSlider = (event, value) => {
    const newState = { ...this.state };
    newState.cent.payload.initialTemp = value[0];
    newState.cent.payload.finalTemp = value[1];
    this.setState(newState, () => console.log(this.state));
  };

  handleToggle = (event, screen, field) => {
    const newState = { ...this.state };
    newState[screen].payload[field] = event;
    this.setState(newState, () => console.log(this.state));
  };

  handleStep = async (screen, next = true) => {
    const newState = { ...this.state };
    const { supervisor } = this.state;

    const data = newState[screen];
    const { step, payload } = data;

    // lógica para cambiar de pantalla atras/adelante
    newState.screen = screen;
    data.step = next ? step + 1 : step - 1;
    if (data.step < 0) {
      data.step = 0;
      newState.screen = "";
    }

    //si estoy en modo supervisor lo inyecto en el payload
    if (supervisor) data.supervisor = true;

    // lógica para recuperar datos en vista de supervisor en step2
    // y para pantallas sample, mill, cent y storage.
    if (data.step === 1 && supervisor && !["batch", "tank"].includes(screen)) {
      const { _batch } = payload;
      const { data: doc } = await getByBatchId(screen, _batch);
      if (doc) data.payload = doc;
    }

    newState[screen] = data;
    this.setState(newState, () => console.log(this.state));
  };

  handleSubmit = async (screen) => {
    console.log("handleSubmit triggered... ", screen);
    const { currentUser } = this.state;
    const newState = { ...this.state };

    const { payload } = newState[screen];
    payload._user = currentUser._id;

    const { submit: labels } = feedbackLabels;

    const submitDB = {
      batch: (screen) => submitBatch(screen),
      samples: (screen) => submitSample(screen),
      mill: (screen) => submitMill(screen),
      cent: (screen) => submitCent(screen),
      storage: (screen) => submitStorage(screen),
      tank: (screen) => submitTank(screen),
    };

    try {
      console.log(payload);
      const response = await submitDB[screen](payload);
      const { data } = response;
      newState[screen].payload = data;
      newState.feedback = { label: labels[screen], number: formatID(data) };
      newState.screen = "feedback";
      this.setState(newState, () => console.log(this.state));
    } catch (error) {
      const { general } = errorMessages;
      alert(general);
      console.log(error);
    }
  };

  handleUpdate = async (screen) => {
    console.log("handleUpdate triggered... ", screen);
    const { currentUser } = this.state;
    const newState = { ...this.state };

    const { payload } = newState[screen];
    payload._supervisor = currentUser._id;

    const { update: labels } = feedbackLabels;

    const updateDB = {
      batch: (screen) => updateBatch(screen),
      samples: (screen) => updateSample(screen),
      mill: (screen) => updateMill(screen),
      cent: (screen) => updateCent(screen),
      storage: (screen) => updateStorage(screen),
      tank: (screen) => updateTank(screen),
    };

    try {
      const response = await updateDB[screen](payload);
      const { data } = response;
      newState[screen].payload = data;
      newState.feedback = { label: labels[screen], number: formatID(data) };
      newState.screen = "feedback";
      this.setState(newState, () => console.log(this.state));
    } catch (error) {
      const { general } = errorMessages;
      alert(general);
      console.log(error);
    }
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
