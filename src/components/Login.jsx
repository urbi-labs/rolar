import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Form, Button, TextInput } from "carbon-components-react";
import Template from "./common/Template";

import { login, getCurrentUser } from "../services/authService";

import "../styles/login.scss";

const textInputProps = {
  className: "",
  id: "username",
  labelText: "Usuario",
  placeholder: "Ingresá tu usuario",
};

const invalidPasswordProps = {
  className: "",
  id: "password",
  labelText: "Contraseña",
  placeholder: "Ingresá tu contraseña",
  invalidText: "Contraseña inválida.",
};

class Login extends Component {
  state = {
    data: {
      username: "",
      password: "",
    },
    error: false,
  };

  handleSubmit = async (e) => {
    const { username, password } = this.state.data;
    e.preventDefault();

    try {
      console.log({ username });
      await login(username, password);
      this.forceUpdate();
    } catch (err) {
      console.log("handleSubmit", err);
      this.setState({ error: true });
    }
  };

  handleChange = (input) => {
    const data = { ...this.state.data };
    data[input.target.id] = input.target.value;
    this.setState({ data });
  };

  render() {
    if (getCurrentUser()) return <Redirect to="/" />;

    const { data, error } = this.state;
    const { username, password } = data;

    return (
      <Form>
        <div className="login bx--grid bx--grid--full-width ">
          <div className="bx--row login__row">
            <div className="bx--col">
              <div className="login--box">
                <div className="bx--row login__row">
                  <div className="bx--col">
                    <div className="login__heading">Bienvenido</div>
                  </div>
                </div>
                <div className="bx--row login__row">
                  <div className="bx--col">
                    <div className="login__helper">
                      Ingresá tus datos para acceder.
                    </div>
                  </div>
                </div>
                <div className="bx--row login__row">
                  <div className="bx--col">
                    <TextInput
                      required
                      {...textInputProps}
                      onChange={(event) => {
                        this.handleChange(event);
                      }}
                      value={username}
                    />
                  </div>
                </div>
                <div className="bx--row login__row">
                  <div className="bx--col">
                    <TextInput
                      type="password"
                      required
                      pattern="^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{5,12}$"
                      invalid={error ? true : false}
                      {...invalidPasswordProps}
                      onChange={(event) => {
                        this.handleChange(event);
                      }}
                      value={password}
                    />
                  </div>
                </div>
                <div className="bx--row">
                  <div className="bx--col">
                    <Button
                      type="submit"
                      onClick={(e) => {
                        this.handleSubmit(e);
                      }}
                    >
                      Ingresá
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default Template(Login);
