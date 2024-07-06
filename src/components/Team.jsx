import React from "react";

export const Team = (props) => {
  return (
    <div id="team" className="text-center">
      <section className="our-team">
        <div>
          <h2><img src="../img/teams.png" className="our-team-img" /> Meet the Team</h2>
          <p>
            Our full-time dedicated team in India comprises of over 20 dedicated
            experienced and certified staff. We have Associates, Seniors,
            Managers and Partners to handle your accounting needs. Tenure and
            experience ranges from 2 years to 18 years, which gives us the
            ability to provide you with just the right level of skills and
            experience
          </p>
          <div className="team-img-div">
          <img src="../img/team.jpeg" className="team-img" />
          </div>
        </div>
      </section>
    </div>
  );
};
