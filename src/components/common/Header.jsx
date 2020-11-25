import React, { useEffect, useState } from "react";

import { getCurrentUser } from "../../services/authService";
import "../../styles/header.scss";

function Header() {
  const [currentUser, setUser] = useState();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  return (
    <div className="header__container">
      <div className="bx--grid">
        <div className="bx--row">
          <div className="bx--col">
            <div className="header__title">Rolar De Cuyo</div>
            <div className="header__role">
              {currentUser ? currentUser.role : ""}
            </div>
          </div>
          <div className="bx--col">
            <div
              className="header__logout"
              onClick={() => {
                if (window.confirm("¿Desea cerrar sesión?")) {
                  localStorage.removeItem("rolar-token");
                  window.location.reload();
                }
              }}
            >
              Salir
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;

// function getUser() {
//   const currentUser = getCurrentUser();
//   setUser(currentUser);
// }
// getUser();
