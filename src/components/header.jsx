import React from "react";
import { useState } from "react";

export const Header = (props) => {
  const [showSubPara, setShowSubPara] = useState(false);
  const [count, setCount] = useState(1);
  setTimeout(() => {
    if(count === 2){
      setCount(1);
      return;
    } 
    setCount(count + 1)
  }, "3000");

  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
