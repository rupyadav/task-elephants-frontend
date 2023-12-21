import React from "react";

export const About = (props) => {
  return (
    <div id="about">
      <div className="container">
        <div className="row">
        <h2>About Us</h2>
          <div className="col-xs-12 col-md-12">
            {" "}
            {/* <img src="img/about.jpg" className="img-responsive" alt="" />{" "} */}
            <h3>{props.data? props.data.heading : "loading..."}</h3>
              <p>{props.data ? props.data.paragraph1 : "loading..."}</p>
              <p>{props.data ? props.data.paragraph2 : "loading..."}</p>
          </div>
          <div className="col-xs-12 col-md-12">
            <div className="about-text">
            <h4>Among the primary things that people take into account prior to outsourcing their services to a provider is their:</h4>
            <div class="container4">
            <div class="card">
                <img class="thumb" src="img/thumb.png" alt="thumb" /><br/>
                <span>Dependability</span>
            </div>
            <div class="card">
                <img class="rs" src="img/rs.png" alt="rs" /><br/>
                <span>Cost - Effectiveness</span>
            </div>
            <div class="card">
                <img class="path" src="img/path.png" alt="path" /><br/>
                <span>Methodology</span>
            </div>
            <div class="card">
                <img class="pointer" src="img/pointer.png" alt="pointer" /><br/>
                <span>Previous work experience</span>
            </div>
        </div>
            {/* <h3>{props.data? props.data.heading : "loading..."}</h3>
              <p>{props.data ? props.data.paragraph1 : "loading..."}</p>
              <p>{props.data ? props.data.paragraph2 : "loading..."}</p> */}
              {/* <h4>Among the primary things that people take into account prior to outsourcing their services to a provider is their:</h4>
              <div className="list-style">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.aboutUsList.map((d, i) => (
                          <li key={`${d}-${i}`}>{d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.Why2.map((d, i) => (
                          <li key={`${d}-${i}`}> {d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div> 
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
