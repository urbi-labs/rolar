import React, { Component } from "react";
import Batch from "./Batch";
import Feedback from "./Feedback";
import Template from "./common/Template";
import Sample from "./Sample";
import Storage from "./Storage";
import Mill from "./Mill";
import Cent from "./Cent";
import Tank from "./Tank";

// fixed settings
import { clients, oliveTypes } from "../config.json";
import { sections, prodLine } from "../config.json";

// submit functions
import {
  submitBatch,
  submitCent,
  submitMill,
  submitStorage,
  submitTank,
  submitSample,
} from "../services/apiService";

//update functions
import {
  updateSample,
  updateMill,
  updateCent,
  updateStorage,
} from "../services/apiService";

// Services
import {
  // tookSampleBatch,
  notSampleBatches,
  getByBatchId,
  getBatchesByStatus,
  getStoragesFromTank,
  getTanks,
  getAllTanks,
  // updateStatus,
} from "../services/apiService";

import { getCurrentUser } from "../services/authService";
import { formatID } from "../util/formats";

import "../styles/home.scss";
class Home extends Component {
  state = {};

  componentDidMount = () => {
    this.handleRestart();

    const currentUser = getCurrentUser();
    const { role } = currentUser;
    const supervisor = role === "supervisor" ? true : false;
    this.setState({ currentUser, supervisor });
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
      tank: {
        payload: {
          _user: "",
          batchArray: [],
          _tank: "",
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
          coneValue: "",
          cone: false,
          radius: "",
        },
        init: {},
        step: 0,
      },
      cent: {
        payload: {
          _batch: "",
          _user: "",
          productionLine: "Linea 1",
          initialTemp: "",
          finalTemp: "",
          kneadingTime: "",
          pumpSpeed: "",
        },
        init: {},
        step: 0,
      },
      mill: {
        payload: {
          _batch: "",
          _user: "",
          productionLine: "Linea 1",
          sieve: "",
          microtalcum: "",
          enzymes: 250,
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
      feedback: { label: "", number: "" },
      screen: "",
    };
    // const data = newState[screen];
    // data.step = 0;
    // newState.screen = "";
    this.setState(newState, () => console.log(this.state));
  };

  renderScreen = (screen) => {
    const { batch, samples, tank, mill, cent, storage, feedback } = this.state;
    const { label, number } = feedback;
    const { supervisor } = this.state;

    const submit = supervisor ? this.handleUpdate : this.handleSubmit;

    const component = {
      batch: (
        <Batch
          data={batch}
          step={this.handleStep}
          submit={submit}
          onComboChange={this.handleComboChange}
          onInputChange={this.handleInputChange}
        />
      ),
      samples: (
        <Sample
          data={samples}
          step={this.handleStep}
          onComboChange={this.handleComboChange}
          onInputChange={this.handleInputChange}
          onCheckChange={this.handleCheckChange}
          submit={submit}
          handleToggle={this.handleToggle}
        />
      ),
      mill: (
        <Mill
          data={mill}
          step={this.handleStep}
          onComboChange={this.handleComboChange}
          onInputChange={this.handleInputChange}
          onCheckChange={this.handleCheckChange}
          submit={submit}
          handleMillSlider={this.handleMillSlider}
        />
      ),
      cent: (
        <Cent
          data={cent}
          step={this.handleStep}
          submit={submit}
          onComboChange={this.handleComboChange}
          onInputChange={this.handleInputChange}
          onCheckChange={this.handleCheckChange}
          handleCentSlider={this.handleCentSlider}
        />
      ),
      storage: (
        <Storage
          data={storage}
          step={this.handleStep}
          submit={submit}
          onComboChangeID={this.handleComboChangeID}
          onComboChange={this.handleComboChange}
          onInputChange={this.handleInputChange}
          onCheckChange={this.handleCheckChange}
          handleToggle={this.handleToggle}
        />
      ),
      tank: (
        <Tank
          data={tank}
          step={this.handleStep}
          submit={submit}
          onComboChangeID={this.handleComboChangeID}
          onComboChange={this.handleComboChange}
          onInputChange={this.handleInputChange}
          onCheckChange={this.handleCheckChange}
          getStoragesFromTank={this.getStoragesFromTank}
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
      tank: this.initializeWithTanks,
    };

    // lógica de inicio para sección desde Home
    newState[screen].init = await initSection[screen]();
    newState.screen = screen;

    this.setState(newState, () => console.log(this.state));
  };

  initializeBatch = () => {
    return {
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
    const status = supervisor ? "mill" : "batch";
    const batches = await this.getBatchesArray(status);
    return { batches, prodLine };
  };

  initializeCents = async () => {
    const { supervisor } = this.state;
    const status = supervisor ? "cent" : "mill";
    const batches = await this.getBatchesArray(status);
    return { batches, prodLine };
  };

  initializeStorage = async () => {
    const { supervisor } = this.state;
    const status = supervisor ? "storage" : "cent";
    const batches = await this.getBatchesArray(status);
    const { data: tanksDB } = await getAllTanks();

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
    return {
      batches,
      tanks,
    };
  };

  getBatchesArray = async (status) => {
    const { data } = await getBatchesByStatus(status);
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

  initializeWithTanks = async () => {
    const { data } = await getTanks();
    const items = [];
    data.forEach((doc, ind) => {
      const { _id, name } = doc;
      items.push({
        id: ind + "",
        text: `Tanque ${name}`,
        value: _id,
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

  handleComboChange = async (event, screen, field) => {
    const newState = { ...this.state };
    const { supervisor } = this.state;
    const { selectedItem } = event;
    const data = newState[screen];

    data.payload[field] = selectedItem ? selectedItem.value : "";

    if (field === "chuteName") {
      data.payload[field] = selectedItem.text;
      data.payload.chuteWeight = selectedItem
        ? parseInt(selectedItem.value)
        : 0;
    }

    // lógica para recuperar datos en vista de supervisor
    if (data.step === 0 && supervisor && screen !== "batch") {
      const { payload } = data;
      const { _batch } = payload;
      const { data: doc } = await getByBatchId(screen, _batch);

      if (doc) {
        data.payload = doc;
        data.supervisor = true;
      }
    }

    newState[screen] = data;

    this.setState(newState, () => console.log(this.state));
  };

  handleInputChange = (event, screen, field) => {
    const newState = { ...this.state };
    newState[screen].payload[field] = event.target.value || "";
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

    // lógica para recuperar datos en vista de supervisor
    if (data.step === 1 && supervisor && screen !== "batch") {
      const { _batch } = payload;
      const { data: doc } = await getByBatchId(screen, _batch);
      if (doc) {
        data.payload = doc;
        data.supervisor = true;
      }
    }

    newState[screen] = data;
    this.setState(newState, () => console.log(this.state));
  };

  handleSubmit = async (screen) => {
    console.log("handleSubmit triggered... ", screen);
    const { currentUser } = this.state;

    const newState = { ...this.state };
    const { payload } = newState[screen];

    // const { _batch } = payload;
    // const status = {
    //   status: screen,
    // };

    payload._user = currentUser._id;
    let label;
    let number;

    try {
      switch (screen) {
        case "batch":
          const { data: batch } = await submitBatch(payload);
          label = "Lote registrado correctamente";
          number = formatID(batch);

          break;

        case "samples":
          const response = await submitSample(payload);
          const { data: sample } = response;
          label = "Control de muestra registrado correctamente";
          number = formatID(sample);

          // await tookSampleBatch(_batch);
          break;

        case "mill":
          const { data: mill } = await submitMill(payload);
          label = "Ingreso a molino registrado correctamente";
          number = formatID(mill);

          // const resp = await updateStatus(_batch, status);
          break;

        case "cent":
          const { data: cent } = await submitCent(payload);
          label = "Ingreso a centrifuga registrado correctamente";
          number = formatID(cent);
          // await updateStatus(_batch, status);
          break;
        case "storage":
          delete payload.radius;
          delete payload.coneValue;
          const { data: storage } = await submitStorage(payload);
          label = "Almacenamiento registrado correctamente";
          number = formatID(storage);

          // await updateStatus(_batch, status);
          // actualizar active del tanque
          break;

        case "tank":
          const { data: tank } = await submitTank(payload);
          label = "Tanque cerrado correctamente";
          number = formatID(tank);
          break;

        default:
          console.log("No screen recognized");
      }

      newState.feedback = { label, number };
      newState.screen = "feedback";
      this.setState(newState, () => console.log(this.state));
    } catch (error) {
      alert(
        "Error de conexión. Si el error persiste contacte a su administrador."
      );
      console.log(error);
    }
  };

  handleUpdate = async (screen) => {
    console.log("handleUpdate triggered... ", screen);
    const { currentUser } = this.state;

    const newState = { ...this.state };
    const { payload } = newState[screen];

    payload._supervisor = currentUser._id;

    let label;
    let number;

    try {
      switch (screen) {
        case "batch":
          const { data: batch } = await submitBatch(payload);
          label = "Lote registrado correctamente";
          number = formatID(batch);

          break;

        case "samples":
          const response = await updateSample(payload);

          const { data: sample } = response;
          label = "Control de muestra actualizado";
          number = formatID(sample);

          break;

        case "mill":
          const { data: mill } = await updateMill(payload);
          label = "Ingreso a molino actualizado";
          number = formatID(mill);

          break;

        case "cent":
          const { data: cent } = await updateCent(payload);
          label = "Ingreso a centrifuga actualizado";
          number = formatID(cent);

          break;
        case "storage":
          // delete payload.radius;
          // delete payload.coneValue;
          const { data: storage } = await updateStorage(payload);
          label = "Almacenamiento actualizado";
          number = formatID(storage);

          break;

        case "tank":
          // const { data: tank } = await submitTank(payload);
          label = "Tanque cerrado correctamente";
          // number = formatID(tank);
          break;

        default:
          console.log("No screen recognized");
      }

      newState.feedback = { label, number };
      newState.screen = "feedback";
      this.setState(newState, () => console.log(this.state));
    } catch (error) {
      alert(
        "Error de conexión. Si el error persiste contacte a su administrador."
      );
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
