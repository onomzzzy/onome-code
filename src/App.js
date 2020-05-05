import React, { useEffect, useState, useReducer } from "react";
import "./App.css";
import axios from "axios";
import Login from "./components/login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Register from "./components/register";
import ErrorPage from "./components/error";
import Blog from "./components/bloger";

export const UserContext = React.createContext();
const uri = "http://localhost:4000/api/user";

function App() {
  const initialState = {
    loggedIn: false,
    username: "",
    role: "",
    firstname: "",
    lastname: "",
    avatar: "",
    address: "",
    phonenumber: "",
    whatsapp: "",
    page: "login",
    message: "",
    msgCode: 0,
  };

  function isAutheticated() {
    let token = localStorage.getItem("onomeToken");
    console.log(`token print ${token}`);
    if (token == null || token == "") {
    } else {
      axios
        .get(uri, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          let usr = res.data;
          if (usr == null || usr === "") {
          } else {
            dispatch({
              type: "OBTAINED_LOG",
              role: usr.role,
              firstname: usr.log.firstname,
              lastname: usr.log.lastname,
              avatar: usr.log.avatar,
              phonenumber: usr.log.phonenumber,
              whatsapp: usr.log.whatsapp,
            });
          }
        })
        .catch((err) => {
          console.log("please check ur connection");
          //setMsgCode(3);
          //setMessage("Please check your connection");
        });
    }
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case "LOGGED_IN":
        state = {
          ...state,
          loggedIn: true,
          username: action.username,
        };
        return state;
      case "OBTAINED_LOG":
        state = {
          ...state,
          role: action.role,
          firstname: action.firstname,
          lastname: action.lastname,
          avatar: action.avatar,
          phonenumber: action.phonenumber,
          whatsapp: action.whatsapp,
        };
        return state;

      case "GLOBAL_MSG":
        state = {
          ...state,
          message: action.message,
          msgCode: action.msgCode,
        };
        return state;

      case "LOGGED_OUT":
        state = initialState;
        return state;
      default:
        return initialState;
    }
  };

  useEffect(() => {
    document.getElementById("loader").style.display = "none";
  }, []);

  const [state, dispatch] = useReducer(reducer, initialState);

  /*useEffect(() => {
    //isAutheticated();
  }, [state.loggedIn]);*/

  return (
    <Router>
      <div>
        <UserContext.Provider
          value={{ userState: state, userDispatch: dispatch }}
        >
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/blogs" component={Blog}>
              {/* {!state.loggedIn ? <Redirect to="/" /> : <Blog />}*/}
            </Route>
            <Route path="**" component={ErrorPage} />
          </Switch>
        </UserContext.Provider>
      </div>

      <div className="footer">
        <div className="footer_margin">
          <div className="row">
            <div className="col">
              <hr></hr>
            </div>
            <div className="col-auto">
              <p>Copyright © 2020 onomecode.com. All rights reserved</p>
            </div>
            <div className="col">
              <hr></hr>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
