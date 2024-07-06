import React from "react";
import HowDoes from "./HowDoes";
import WhyUsAccordion from "./WhyUsAccordion";

function WhatHowWhy() {
  return (
    <>
      <div id="what-we-do">
        <section className="what-we-do">
          <div>
            <h2>
              <img src="../img/whatwedo.png" /> What Does Task Elephant Do?
            </h2>
            <p>
              We specialize in bookkeeping services to help our clients reduce
              costs, increase their margins and net profits. We serve both small
              to midsize businesses and accounting firms. Streamline your
              workflow and focus on your business, via utilizing our expert
              bookkeeping services to increase your margins/profits while
              reducing the stress of turnover or rate increases.
            </p>
            <p>
              {" "}
              Using our client ‘on-boarding process’ we can transition your
              bookkeeping tasks to our dedicated team of over 20 experienced and
              trained Accounting specialists in Mumbai, India. We handle
              everything securely and efficiently, so you can focus on running
              your business.
            </p>
            <p>
              Enjoy the convenience of personalized service with a dedicated US
              point of contact. No impersonal web forms or overseas calls
              required – just direct unlimited access to our US personnel for
              any questions or concerns.
            </p>
          </div>
        </section>
      </div>

      <HowDoes />
      <div id="why-us">
        <section className="why-us">
          <div>
            <h2>
              <img src="../img/whyus.png" className="why-do-us-img" /> Why Task
              Elephant?
            </h2>
            <p>
              <b>
                Tired of rising labor costs? Staff turnover? Is inflation eating
                into your profit ? Can’t take on new client work because your
                existing staff are stretched thin or burnt out ? Increasing
                Accounting costs ?
              </b>
            </p>
            <WhyUsAccordion />
          </div>
        </section>
      </div>
      <div id="data-protection">
        <section className="data-protection">
          <div>
            <h2>
              <img src="../img/data-protection.png" />
              How We Protect Your Data
            </h2>
            <p>
              Our client’s data is stored on secure encrypted servers hosted in
              the US. Each client has their own secure portal running on Amazon
              AWS S3, our portal has been custom developed with{" "}
              <b>security and availability</b> as a priority. Our clients can
              upload/download documents securely. We do not require ANY data
              which has PII (e.g., social security numbers, dates of birth,
              addresses, etc.). Our servers utilize Secure Socket Layer
              Certified (SSL Certified).
            </p>
          </div>
        </section>
      </div>
      <div id="next-step">
        <section className="next-step">
          <div>
            <h2>
              <img src="../img/nextstep.png" className="next-step-img" />
              Next Steps
            </h2>
            <p>
              Give us a call to schedule a complimentary consultation to see how
              Task Elephants can help <br />
              <div className="step-section">
                <div className="circle">
                  <p>Reduce Rour Costs</p>
                </div>
                <img src="../img/arrow.png" className="arrow-img" />
                <div className="circle">
                  <p>Increase Your Profits</p>
                </div>
                <img src="../img/arrow.png" className="arrow-img" />
                <div className="circle">
                  <p>Reduce Stress</p>
                </div>
                <img src="../img/arrow.png" className="arrow-img" />
                <div className="circle">
                  <p>Grow Your Business</p>
                </div>
              </div>
            </p>
          </div>
        </section>
      </div>
      {/* <section className="our-team">
        <div>
          <h2>Your Dedicated Team !</h2>
          <p>
            Our full-time dedicated team in India comprises of over 20 dedicated
            experienced and certified staff. We have Associates, Seniors,
            Managers and Partners to handle your accounting needs. Tenure and
            experience ranges from 2 years to 18 years, which gives us the
            ability to provide you with just the right level of skills and
            experience
          </p>
          <img src="../img/team.jpeg" className="team-img" />
        </div>
      </section> */}
    </>
  );
}

export default WhatHowWhy;
