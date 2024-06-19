import React from "react";
import { useInView } from 'react-intersection-observer';

export const About = (props) => {
  const { ref: card1Ref, inView: card1InView } = useInView({ triggerOnce: false });
  const { ref: card2Ref, inView: card2InView } = useInView({ triggerOnce: true });
  const { ref: card3Ref, inView: card3InView } = useInView({ triggerOnce: false });
  const { ref: card4Ref, inView: card4InView } = useInView({ triggerOnce: true });

  return (
    <div id="about">
      <div className="container">
        <div className="row">
          <h2>About Us</h2>
          <div className="col-xs-12 col-md-12">
            <h3>{props.data ? props.data.heading : "loading..."}</h3>
            <p>{props.data ? props.data.paragraph1 : "loading..."}</p>
            <p>{props.data ? props.data.paragraph2 : "loading..."}</p>
          </div>
          <div className="col-xs-12 col-md-12">
            <div className="about-text">
              <h4>Among the primary things that people take into account prior to outsourcing their services to a provider is their:</h4>
              <div className="container4">
                <div ref={card1Ref} className={`card card-1 ${card1InView ? 'animate' : ''}`}>
                  <img className="thumb" src="img/thumb.png" alt="thumb" /><br/>
                  <span>Dependability</span>
                </div>
                <div ref={card2Ref} className={`card card-2 ${card2InView ? 'animate' : ''}`}>
                  <img className="rs" src="img/rs.png" alt="rs" /><br/>
                  <span>Cost - Effectiveness</span>
                </div>
                <div ref={card3Ref} className={`card card-3 ${card3InView ? 'animate' : ''}`}>
                  <img className="path" src="img/path.png" alt="path" /><br/>
                  <span>Methodology</span>
                </div>
                <div ref={card4Ref} className={`card card-4 ${card4InView ? 'animate' : ''}`}>
                  <img className="pointer" src="img/pointer.png" alt="pointer" /><br/>
                  <span>Previous work experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
