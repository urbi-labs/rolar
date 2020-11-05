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
import { updateSample } from "../services/apiService";

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
          _user: "",
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
          _user: "",
          productionLine: "",
          sieve: "",
          microtalcum: "",
          enzymes: 0,
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
      samples: (
        <Sample
          data={samples}
          step={this.handleStep}
          onComboChange={this.handleComboChange}
          onInputChange={this.handleInputChange}
          onCheckChange={this.handleCheckChange}
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
      cent: this.getCentBatches,
      storage: this.getStorageBatches,
      tank: this.initializeWithTanks,
    };

    // lógica de inicio para sección desde Home
    newState[screen].init = await initSection[screen]();
    newState.screen = screen;

    this.setState(newState, () => console.log(this.state));
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

    return items;
  };

  initializeMills = async () => {
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
      parcels: [...Array(15).keys()].map((x) => {
        return { id: x, text: x + 1 + "", value: x + 1 };
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
    const { selectedItem } = event;
    newState[screen].payload[field] = selectedItem
      ? selectedItem.value // .text
      : "";

    if (field === "chuteName") {
      newState[screen].payload[field] = selectedItem.text;
      newState[screen].payload.chuteWeight = selectedItem
        ? parseInt(selectedItem.value)
        : 0;
    }

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
      const { data } = await getByBatchId(screen, _batch);
      if (data) {
        data.payload = data;
        data.supervisor = true;
      }
    }

    newState[screen] = data;
    this.setState(newState, () => console.log(this.state));
  };

  handleSubmit = async (screen) => {
    console.log("handleSubmit triggered... ", screen);
    const { currentUser, supervisor } = this.state;

    const newState = { ...this.state };
    const { payload } = newState[screen];

    // const { _batch } = payload;
    // const status = {
    //   status: screen,
    // };

    payload._user = currentUser._id;

    try {
      switch (screen) {
        case "batch":
          const { data: batch } = await submitBatch(payload);

          newState.feedback = {
            label: "Lote registrado correctamente",
            number: formatID(batch),
          };
          break;

        case "samples":
          const response = supervisor
            ? await updateSample(payload)
            : await submitSample(payload);

          const { data: sample } = response;
          newState.feedback = {
            label: "Control de muestra registrado correctamente",
            number: formatID(sample),
          };
          break;

        // await tookSampleBatch(_batch);

        case "mill":
          const { data: mill } = await submitMill(payload);
          // const resp = await updateStatus(_batch, status);
          newState.feedback = {
            label: "Ingreso a molino registrado correctamente",
            number: formatID(mill),
          };
          break;

        case "cent":
          await submitCent(payload);
          // await updateStatus(_batch, status);
          break;
        case "storage":
          delete payload.radius;
          delete payload.coneValue;
          await submitStorage(payload);
          // await updateStatus(_batch, status);
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
    } catch (error) {
      alert(
        "Error de conexión. En caso de persistir el error contacte a su administrador."
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
