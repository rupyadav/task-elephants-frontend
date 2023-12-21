import React from "react";

export const Services = (props) => {
  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
          <h3>
          Comprehensive Financial Services Tailored to Your Business Needs
          </h3>
          <p>
          Panamera provides comprehensive financial services, 
          including the preparation of accurate financial statements,
           efficient payroll management, meticulous bank reconciliation, 
           expert tax preparation, precise bookkeeping, and proficient management of 
           accounts payable and receivable. 
           Our dedicated team ensures your financial operations run smoothly, 
           allowing you to focus on growing your business.
          </p>
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
