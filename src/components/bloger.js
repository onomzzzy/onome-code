import React, { useState, useReducer, useRef } from "react";
import "../App.css";
import "../components/blog.css";
import { InputText } from "primereact/inputtext";
import onome from "../icons/onome.png";
import login from "../icons/power-button.png";
import glasses from "../icons/glasses.png";
import sam from "../icons/mic1.jpg";
import blogger from "../icons/blogger.png";
import plus from "../icons/plus.png";
import writing from "../icons/writing.png";
import subscribers from "../icons/groupL.png";
import key from "../icons/key.png";
import CreateBlog from "../components/createblog";

import {
  BrowserRouter as Route,
  Link,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import ChangePassword from "./changepassword";

function Blog(props) {
  switch (props.id) {
    case "create":
      return <CreateBlog />;
    case "changepassword":
      return <ChangePassword />;
    default:
      return <CreateBlog />;
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case "BORDER_CHANGE":
      state = {
        ...state,
        [state.current]: false,
        [action.blogId]: true,
        current: action.blogId,
        blogId: action.blogId,
      };
      return state;
  }
};

function Blogger() {
  const initialState = {
    create: true,
    allblogs: false,
    changepassword: false,
    subscribers: false,
    current: "create",
    blogId: "create",
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const blogs = [
    {
      page: "Create Blog",
      id: "create",
      btnicon: plus,
      border: state.create,
    },
    {
      page: "All Blogs",
      id: "allblogs",
      btnicon: writing,
      border: state.allblogs,
    },
    {
      page: "Change Password",
      id: "changepassword",
      btnicon: key,
      border: state.changepassword,
    },
    {
      page: "Subscribers",
      id: "subscribers",
      btnicon: subscribers,
      border: state.subscribers,
    },
  ];

  let { path, url } = useRouteMatch();
  const fileInput = useRef();
  return (
    <div className="body">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <div className="header">
                  <div className="card">
                    <div className="row">
                      <div className="col-3"></div>
                      <div className="col-6">
                        <div></div>
                      </div>
                      <div className="col-3">
                        <div className="other_icon">
                          <img src={login} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="side_nav">
              <div className="card">
                <div className="profile_img">
                  <input
                    ref={fileInput}
                    style={{ display: "none" }}
                    type="file"
                  />
                  <img src={sam} onClick={() => fileInput.current.click()} />
                </div>
              </div>
              <div className="push">
                <h3>Micheal Nzegbuna</h3>
              </div>
              <div className="blogger-photo">
                <span>
                  <img src={blogger} /> Blogger
                </span>
              </div>

              <div className="blog-menu">
                {blogs.map(({ page, id, btnicon, border }) => (
                  <div key={id}>
                    <Link to={`${url}/${id}`}>
                      <div
                        onClick={(e) => {
                          dispatch({ type: "BORDER_CHANGE", blogId: id });
                        }}
                        className={
                          border ? "blog-menu-link" : "blog-menu-non-link"
                        }
                      >
                        <span>
                          {page} <img src={btnicon} />
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-9">
            <div className="col_border">
              <Switch>
                <Route exact path={path}>
                  <h3>Please select a Blog.</h3>
                </Route>
                <Route path={`${path}/:id`}>
                  <Blog id={state.blogId} />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blogger;
