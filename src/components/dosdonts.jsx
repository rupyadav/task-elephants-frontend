import React from "react";

export const DosDonts = (props) => {
  return (
    <div id="dosdonts" className="text-center">
      <div className="container">
        <div className="row">
        <div className="col-md-12 section-title">
          <h2>What We Do</h2>
          <div className="list-style dos">
                <div className="col-lg-12 col-sm-12 col-xs-12 margin-bottom-30">
                  <ul>
                    {props.data
                      ? props.data.dos.map((d, i) => (
                          <li key={`${d}-${i}`}>{d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
                </div>
        </div>
        <div className="col-md-12 section-title">
          <h2>What We Don't</h2>
          <div className="list-style donts">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.donts.map((d, i) => (
                          <li key={`${d}-${i}`}>{d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
                </div>
        </div>
        </div>
      </div>
    </div>
  );
};
