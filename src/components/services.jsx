import React from "react";

export const Services = (props) => {
  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
          <h3>
          Comprehensive Services Tailored to Your Business Needs
          </h3>
          <p>
          Task Elepahnts provides comprehensive financial services, 
          including the preparation of Book keeping records, bank reconciliation, 
           Our dedicated team ensures your financial operations run smoothly, 
           allowing you to focus on growing your business.
          </p>
          <p>We offer customize solutions to suit businesses at any stage of their lifecycle.
             Our professional services are offered on an hourly or fixed rate basis.</p>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="col-md-4">
                  {" "}
                  <img src={d.url} />
                  <div className="service-desc">
                    <h3>{d.name}</h3>
                    {/* <p>{d.text}</p> */}
                  </div>
                </div>
              ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};
