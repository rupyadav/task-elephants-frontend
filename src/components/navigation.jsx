import React from "react";
import { useState } from 'react';
import LoginDialog from "./LoginDialog";
import { LoginModal } from "./LoginModal";

export const Navigation = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  return (
    <>
      <nav id="menu" className="navbar navbar-default navbar-fixed-top">
        <div className="container custom-header">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
            >
              {" "}
              <span className="sr-only">Toggle navigation</span>{" "}
              <span className="icon-bar"></span>{" "}
              <span className="icon-bar"></span>{" "}
              <span className="icon-bar"></span>{" "}
            </button>
            <a className="navbar-brand page-scroll" href="#page-top">
            <img src="img/ICON.svg" alt="logo" className="responsive-logo" />
            </a>{" "}
          </div>

          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="#" className="page-scroll">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="page-scroll">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="page-scroll">
                  Services
                </a>
              </li>
              {/* <li>
                <a href="#team" className="page-scroll">
                  Team
                </a>
              </li> */}
              <li>
                <a href="#contact" className="page-scroll">
                  Contact
                </a>
              </li>
              <li>
                <a onClick={handleShow} className="page-scroll">
                  Login
                </a>
              </li>
            </ul>
            {/* {show && <LoginModal show={show} handleClose={handleClose} />} */}
            {/* {show && <Login show={show} handleClose={handleClose} />} */}
            {show && <LoginDialog show={show} handleClose={handleClose} />}
          </div>
        </div>
      </nav>
    </>
  );
};
