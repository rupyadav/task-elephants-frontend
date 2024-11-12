import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import MultifactorLogin from "./MultifactorLogin";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // const [activeSection, setActiveSection] = useState("home");

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('loggedInUser');
    navigate('/');
}
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const observer = useRef();


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
            <a className="navbar-brand page-scroll" href="/">
              <img src="img/ICON.svg" alt="logo" className="responsive-logo" />
            </a>{" "}
          </div>

          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <ul className="nav navbar-nav navbar-right">
              {localStorage.getItem('token') ? (
                <>
                <li>
                <a href="/dashboard">
                  Dashboard
                </a>
              </li>
                <li>
                <Button
                onClick={handleLogout}
                variant="primary"
                style={{
                  border: "2px solid",
                  borderRadius: "50px",
                  backgroundColor: "#EE7501",
                  color: "white",
                  width: '100px',
                  fontSize: '16px',
                  paddingBottom: '10px'
                }}
              >
                Logout
              </Button>
              </li>
              {/* <li><h4>{localStorage.getItem('userName')} <IconButton color="success" fontSize="small">
                                <Avatar />
                            </IconButton></h4></li> */}
              </>
              ) : (
                <>
                <li>
                <a href="#home" className="page-scroll">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="page-scroll">
                  About Us
                </a>
              </li>
              <li>
                <a href="#team" className="page-scroll">
                  Our Team
                </a>
              </li>
              <li>
                <a href="#contact" className="page-scroll">
                  Contact
                </a>
              </li>
              <Button
                onClick={handleShow}
                variant="primary"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  border: "2px solid",
                  borderRadius: "50px",
                  backgroundColor: "#EE7501",
                  color: "white",
                  width: '100px',
                  fontSize: '16px',
                  paddingBottom: '10px'
                }}
              >
                Login
              </Button>
                </>
              )}
            </ul>
            {show && <MultifactorLogin  handleClose={handleClose} />}
            {/* {show && <LoginDialog show={show} handleClose={handleClose} />} */}
          </div>
        </div>
      </nav>
    </>
  );
};
