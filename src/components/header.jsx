import React from "react";
import { useState } from "react";

export const Header = (props) => {
  const [showSubPara, setShowSubPara] = useState(false)
  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : "Loading"}</p>
                {showSubPara && <p>{props.data ? props.data.subparagraph : "Loading"}</p>}
                <a
                  onClick={() => setShowSubPara(!showSubPara)}
                  className="btn btn-custom btn-lg page-scroll"
                >
                  {showSubPara ? "Learn Less" : "Learn More"}
                </a>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
