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
              {/* <div className="brand-text" style={{ fontFamily: 'Armada Bold'}}>Task Elephants</div> */}
                {/* <br></br> */}
                {/* <p style={{ fontFamily: 'Barlow Semibold'}}>
                  {count === 1 && <span style={{color: '#EC9418', fontWeight: 'Bold', fontSize: '26px'}}>{props.data?.features1}</span>}
                  {count === 2 && <span style={{color: '#EC9418', fontWeight: 'Bold', fontSize: '26px'}}>{props.data?.features2}</span>}
                 {props.data ? props.data.paragraph : "Loading"}</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
