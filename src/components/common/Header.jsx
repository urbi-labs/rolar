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
      <div className="header__title">Rolar De Cuyo</div>
      {currentUser === "supervisor" && (
        <div className="header__role">{currentUser.role}</div>
      )}
    </div>
  );
}

export default Header;

// function getUser() {
//   const currentUser = getCurrentUser();
//   setUser(currentUser);
// }
// getUser();
