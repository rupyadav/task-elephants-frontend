import React, { useState, useEffect } from "react";
import { Header } from "./header";
import { About } from "./about";
import { Team } from "./Team";
import { Contact } from "./contact";
import { FadeInSection } from "./FadeInSection";
import WhatHowWhy from "./WhatHowWhy";
import Footer from "./Footer";
import JsonData from "../data/data.json";


function Home() {

const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <>
      <Header data={landingPageData.Header} />
      <FadeInSection>
        <About data={landingPageData.About} />
      </FadeInSection>
      <FadeInSection>
        <WhatHowWhy />
      </FadeInSection>
      <FadeInSection>
        <Team />
      </FadeInSection>
      <FadeInSection>
        <Contact data={landingPageData.Contact} />
      </FadeInSection>
      <FadeInSection>
        <Footer />
      </FadeInSection>
    </>
  );
}

export default Home;
