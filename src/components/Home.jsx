import React, { Component } from "react";
import Template from "./common/Template";

import "../styles/home.scss";

class Home extends Component {
  state = {};
  render() {
    return (
      <div className="home__container">
        <div className="home__wrapper">
          {[0, 1, 2, 3, 4, 5].map((e, i) => (
            <div className="home__tile" key={i}>
              <div className="home__tile-button">{e}</div>
              <div className="home__tile-label">label</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Template(Home);
