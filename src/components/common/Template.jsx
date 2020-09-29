import React from "react";
import Header from "./Header";

import "../../styles/template.scss";

function Template(Screen) {
  return () => (
    <div>
      <Header />
      <Screen />
    </div>
  );
}

export default Template;
