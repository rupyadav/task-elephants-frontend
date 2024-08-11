import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import LoginDialog from "./LoginDialog";
import MultifactorLogin from "./MultifactorLogin";

export const Navigation = () => {
  const [show, setShow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // const [activeSection, setActiveSection] = useState("home");

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const observer = useRef();

  // useEffect(() => {
  //   const sections = document.querySelectorAll("section");
  //   const options = {
  //     threshold: 0.7,
  //   };

  //   observer.current = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         setActiveSection(entry.target.id);
  //       }
  //     });
  //   }, options);

  //   sections.forEach((section) => {
  //     observer.current.observe(section);
  //   });

  //   return () => {
  //     if (observer.current) {
  //       observer.current.disconnect();
  //     }
  //   };
  // }, []);

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
            <a className="navbar-brand page-scroll" href="#home">
              <img src="img/ICON.svg" alt="logo" className="responsive-logo" />
            </a>{" "}
          </div>

          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <ul className="nav navbar-nav navbar-right">
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
              {/* <li className={activeSection === "services" ? "active" : ""}>
                <a href="#services" className="page-scroll">
                  Services
                </a>
              </li> */}
              <li>
                <a href="#contact" className="page-scroll">
                  Contact
                </a>
              </li>
              <li>
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
              </li>
            </ul>
            {show && <MultifactorLogin  handleClose={handleClose} />}
            {/* {show && <LoginDialog show={show} handleClose={handleClose} />} */}
          </div>
        </div>
      </nav>
    </>
  );
};
