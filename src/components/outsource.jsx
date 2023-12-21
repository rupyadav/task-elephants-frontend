import React from "react";

export const Outsource = (props) => {
  return (
    <div id="outsource" className="text-center">
      <div className="container">
      <div className="section-title">
          <h2>Why Outsource?</h2>
          <h3>
          Take a Leap
          </h3>
          <p>
          Among the primary things that people take into account prior to outsourcing their services to a provider is their dependability, cost-effectiveness, previous work experience and most significantly their methodology of work. The benefits include:
          </p>
          <div className="list-style outsource-div">
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.why1.map((d, i) => (
                          <li key={`${d}-${i}`}>{d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.why2.map((d, i) => (
                          <li key={`${d}-${i}`}> {d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div> 
              </div>
        </div>
      </div>
    </div>
  );
};
