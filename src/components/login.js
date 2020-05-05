import React, { useState, useContext } from "react";
import logo from "../icons/logo.png"; // Tell webpack this JS file uses this image
import lockicon from "../icons/unlock.png"; // Tell webpack this JS file uses this image
import { Link } from "react-router-dom";
import "../components/login.css";
import axios from "axios";
import Messages from "../components/messages";
import { UserContext } from "../App";

const uri = "http://localhost:4000/api/login";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [msgCode, setMsgCode] = useState(0);

  const userContext = useContext(UserContext);

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function contantServer() {
    axios
      .get(uri, {
        username: username,
        password: password,
      })
      .then((res) => {
        let token = res.data;
        if (token == null || token === "") {
          setMsgCode(4);
          setMessage("Invalid Credentials");
        } else {
          localStorage.setItem("onomeToken", token);
          userContext.userDispatch({ type: "LOGGED_IN", username: username });
          setMsgCode(1);
          setMessage("Login Successfull");
        }
      })
      .catch((err) => {
        setMsgCode(4);
        setMessage("Invalid Credentials");
      });
  }

  function handleUserValidation(e) {
    let validEmail = e.target.value.match(
      /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
    );
    if (!validEmail) {
      setMsgCode(4);
      setMessage("Username must be a valid email");
    } else {
      setMsgCode(0);
      setMessage("");
    }
  }

  function handlePasswordValidation(e) {
    if (e.target.value.length < 7) {
      setMsgCode(3);
      setMessage("Password must be greater than 6 characters");
    } else {
      setMsgCode(0);
      setMessage("");
    }
  }

  return (
    <div className="page">
      <div className="login-body ui-fluid">
        <div className="login-panel">
          <div className="login-panel-header">
            <img src={logo} alt="Logo"></img>
          </div>
          <div className="login-panel-content">
            <div className="ui-g-12">
              <h1>Sign-in with Onome Code</h1>
            </div>
            <Messages message={message} msgCode={msgCode}></Messages>
            <div className="ui-g">
              <div className="ui-g-12">
                <div className="input-field">
                  <input
                    type="text"
                    id="username"
                    onBlur={handleUserValidation}
                    onChange={handleUsernameChange}
                    required
                  />
                  <label htmlFor="username">Username</label>
                </div>
              </div>

              <div className="ui-g-12">
                <div className="input-field">
                  <input
                    type="text"
                    id="password"
                    onBlur={handlePasswordValidation}
                    onChange={handlePasswordChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
              </div>

              <div className="ui-g-12">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-7">
                      <div>
                        <label className="container">
                          <input
                            type="checkbox"
                            checked={remember}
                            onChange={() => setRemember(!remember)}
                          />
                          <span className="checkmark"></span>
                          <span className="rme">Remember Me ?</span>
                        </label>
                      </div>
                    </div>
                    <div className="col-5">
                      <a className="reset_pwd" href="">
                        Reset Password
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ui-g-12">
                <button
                  type="button"
                  onClick={contantServer}
                  className="btn btn-sm"
                >
                  Login <img src={lockicon}></img>
                </button>
              </div>
              <div className="ui-g-12">
                <span className="account_d">
                  Don't have an account?{" "}
                  <Link to="/register">
                    <span>Sign Up</span>
                  </Link>{" "}
                  now.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
