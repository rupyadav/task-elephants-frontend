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
                <br></br>
                <h1 style={{ fontFamily: 'Armada Bold'}}>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <br></br>
                <br></br>
                <p style={{ fontFamily: 'Barlow Semibold'}}>
                  {count === 1 && <span style={{color: '#f4d956', fontWeight: 600, fontSize: '26px'}}>{props.data?.features1}</span>}
                  {count === 2 && <span style={{color: '#f4d956', fontWeight: 600, fontSize: '26px'}}>{props.data?.features2}</span>}
                  {/* {count === 3 && <span style={{color: '#f4d956', fontWeight: 600}}>{props.data?.features3}</span>}
                  {count === 4 && <span style={{color: '#f4d956', fontWeight: 600}}>{props.data?.features4}</span>} */}
                 {props.data ? props.data.paragraph : "Loading"}</p>
                {/* {showSubPara && <p>{props.data ? props.data.subparagraph : "Loading"}</p>}
                <a
                  onClick={() => setShowSubPara(!showSubPara)}
                  className="btn btn-custom btn-lg page-scroll"
                >
                  {showSubPara ? "Learn Less" : "Learn More"}
                </a>{" "} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
