import React, { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";
import { Outsource } from "./components/outsource";
import { DosDonts } from "./components/dosdonts";
import { FadeInSection } from "./components/FadeInSection";
import { PrimeReactProvider } from 'primereact/api';
import WhatHowWhy from "./components/WhatHowWhy";
import Footer from "./components/Footer";
        

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <PrimeReactProvider>
      <Navigation />
      <Header data={landingPageData.Header} />
      <FadeInSection>
        <About data={landingPageData.About} />
      </FadeInSection>
      <FadeInSection>
        <WhatHowWhy />
      </FadeInSection>
      {/* <FadeInSection>
        <Services data={landingPageData.Services} />
      </FadeInSection>
      <FadeInSection>
        <DosDonts data={landingPageData.DosAndDonts} />
      </FadeInSection>
      <FadeInSection>
        <Outsource data={landingPageData.Outsource} />
      </FadeInSection> */}
      <FadeInSection>
        <Team/>
      </FadeInSection>
      <FadeInSection>
        <Contact data={landingPageData.Contact} />
      </FadeInSection>
      <FadeInSection>
        <Footer />
      </FadeInSection>
      </PrimeReactProvider>
  );
};

export default App;
