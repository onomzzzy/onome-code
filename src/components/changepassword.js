import React from "react";
import key from "../icons/key1.png";
import { InputTextarea } from "primereact/inputtextarea";

function ChangePassword() {
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="jumbotron">
              <h1 className="display-5">Reset Password!!!</h1>
              <p className="lead">
                In order to reset password your old password is required
              </p>
              <hr className="my-4" />
              <p>Can't remember Password ? Contact admin</p>
            </div>
          </div>
          <div className="col-6">
            <InputTextarea
              rows={1}
              placeholder="Old Password"
              autoResize={true}
              cols={30}
            />
          </div>
          <div className="col-6">
            <InputTextarea
              rows={1}
              placeholder="New Password"
              cols={30}
              autoResize={true}
            />
          </div>
          <div className="col-6">
            <InputTextarea
              rows={1}
              placeholder="Confirm New Password"
              cols={30}
              autoResize={true}
            />
          </div>
          <div className="col-6">
            <button type="button" className="btn btn-sm">
              Login <img src={key}></img>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
